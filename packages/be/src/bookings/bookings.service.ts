import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  type CreateBookingDto,
  EventBookingsQueryDto,
  EventBookingsResponseDto,
  GetBookingDto,
  type UpdateBookingDto,
} from "@reservation-app/shared";
import type { Model } from "mongoose";
import { Types } from "mongoose";
import {
  Booking,
  BookingDocument,
  BookingStatus,
} from "src/schemas/booking.schema";
import { Event, EventDocument } from "src/schemas/event.schema";
import type { UserDocument } from "src/schemas/user.schema";
import { UsersService } from "src/users/users.service";

@Injectable()
export class BookingsService {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_PAGE_SIZE = 20;
  private readonly MAX_PAGE_SIZE = 50;

  constructor(
    @InjectModel(Booking.name)
    private readonly bookingModel: Model<BookingDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
    private readonly usersService: UsersService
  ) {}

  async createBooking(
    eventId: string,
    dto: CreateBookingDto,
    requesterId: string
  ): Promise<GetBookingDto> {
    const seats = this.ensureValidSeatCount(dto.seats);
    const attendeeObjectId = this.toObjectId(
      dto.attendeeId ?? requesterId,
      "attendeeId"
    );

    if (attendeeObjectId.toString() !== requesterId) {
      throw new ForbiddenException(
        "Non è possibile creare prenotazioni per altri utenti"
      );
    }

    const attendee = await this.usersService.findById(
      attendeeObjectId.toString()
    );
    if (!attendee) {
      throw new NotFoundException("Utente non trovato");
    }

    const event = await this.getEventOrThrow(eventId);
    this.ensureEventIsBookable(event);
    await this.incrementReservedSeats(event, seats);

    const booking = await this.bookingModel.create({
      eventId: event._id,
      attendeeId: attendeeObjectId,
      seats,
      status: BookingStatus.Confirmed,
    });

    await booking.populate("attendeeId", ["email", "displayName"]);
    return this.mapBookingToDto(booking);
  }

  async getEventBookings(
    eventId: string,
    query: EventBookingsQueryDto
  ): Promise<EventBookingsResponseDto> {
    const event = await this.getEventOrThrow(eventId);
    const page = this.normalizePage(query?.page);
    const pageSize = this.normalizePageSize(query?.pageSize);

    type BookingFilter = Parameters<Model<BookingDocument>["find"]>[0];

    const filter: BookingFilter = {
      eventId: event._id,
    };

    if (query?.status) {
      filter.status = query.status;
    }

    if (query?.attendeeEmail?.trim()) {
      const attendee = await this.usersService.findByEmail(
        query.attendeeEmail.trim()
      );
      if (!attendee) {
        return this.createEmptyBookingsResponse(event, page, pageSize);
      }
      filter.attendeeId = attendee._id;
    }

    const [bookings, total] = await Promise.all([
      this.bookingModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate("attendeeId", ["email", "displayName"])
        .exec(),
      this.bookingModel.countDocuments(filter),
    ]);

    const response = new EventBookingsResponseDto();
    response.eventId = event._id.toString();
    response.items = bookings.map((booking) => this.mapBookingToDto(booking));
    response.page = page;
    response.pageSize = pageSize;
    response.total = total;
    response.availableSeats = this.calculateAvailableSeats(event);
    return response;
  }

  async updateBooking(
    bookingId: string,
    dto: UpdateBookingDto,
    requesterId: string
  ): Promise<GetBookingDto> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException("Prenotazione non trovata");
    }

    this.ensureOwnership(booking, requesterId);
    this.ensureNotCancelled(booking);

    let seatDelta = 0;
    if (typeof dto.seats === "number") {
      const normalized = this.ensureValidSeatCount(dto.seats);
      seatDelta = normalized - booking.seats;
      booking.seats = normalized;
    }

    if (typeof dto.status === "string") {
      if (dto.status === BookingStatus.Cancelled) {
        throw new BadRequestException(
          "Usa l'endpoint di cancellazione per annullare una prenotazione"
        );
      }
      booking.status = dto.status as BookingStatus;
    }

    if (seatDelta !== 0) {
      await this.adjustReservedSeats(booking.eventId, seatDelta);
    }

    const saved = await booking.save();
    await saved.populate("attendeeId", ["email", "displayName"]);
    return this.mapBookingToDto(saved);
  }

  async cancelBooking(
    bookingId: string,
    requesterId: string
  ): Promise<GetBookingDto> {
    const booking = await this.bookingModel.findById(bookingId).exec();
    if (!booking) {
      throw new NotFoundException("Prenotazione non trovata");
    }

    this.ensureOwnership(booking, requesterId);

    if (booking.status === BookingStatus.Cancelled) {
      throw new ConflictException("La prenotazione è già cancellata");
    }

    booking.status = BookingStatus.Cancelled;
    booking.cancelledAt = new Date();

    await this.adjustReservedSeats(booking.eventId, -booking.seats);

    const saved = await booking.save();
    await saved.populate("attendeeId", ["email", "displayName"]);
    return this.mapBookingToDto(saved);
  }

  private async incrementReservedSeats(
    event: EventDocument,
    seats: number
  ): Promise<void> {
    const availableSeats = this.calculateAvailableSeats(event);
    if (seats > availableSeats) {
      throw new ConflictException("Posti esauriti per questo evento");
    }

    const result = await this.eventModel
      .updateOne(
        { _id: event._id, reservedSeats: event.reservedSeats },
        { $inc: { reservedSeats: seats } }
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new ConflictException(
        "La disponibilità è cambiata, riprova a prenotare"
      );
    }

    event.reservedSeats += seats;
  }

  private async adjustReservedSeats(
    eventId: Types.ObjectId,
    delta: number
  ): Promise<void> {
    if (delta === 0) {
      return;
    }

    if (delta > 0) {
      const event = await this.getEventOrThrow(eventId.toString());
      await this.incrementReservedSeats(event, delta);
      return;
    }

    const result = await this.eventModel
      .updateOne(
        { _id: eventId, reservedSeats: { $gte: Math.abs(delta) } },
        { $inc: { reservedSeats: delta } }
      )
      .exec();

    if (result.modifiedCount === 0) {
      throw new ConflictException(
        "Impossibile aggiornare i posti riservati per l'evento"
      );
    }
  }

  private async getEventOrThrow(
    eventId: string | Types.ObjectId
  ): Promise<EventDocument> {
    const id =
      typeof eventId === "string"
        ? this.toObjectId(eventId, "eventId")
        : eventId;
    const event = await this.eventModel.findById(id).exec();
    if (!event) {
      throw new NotFoundException("Evento non trovato");
    }
    return event;
  }

  private ensureEventIsBookable(event: EventDocument): void {
    if (event.startAt <= new Date()) {
      throw new BadRequestException(
        "Quest'evento non accetta più prenotazioni"
      );
    }
  }

  private ensureOwnership(booking: BookingDocument, userId: string): void {
    if (booking.attendeeId.toString() !== userId) {
      throw new ForbiddenException("Operazione non consentita");
    }
  }

  private ensureNotCancelled(booking: BookingDocument): void {
    if (booking.status === BookingStatus.Cancelled) {
      throw new ConflictException(
        "La prenotazione è stata cancellata: non può essere modificata"
      );
    }
  }

  private mapBookingToDto(booking: BookingDocument): GetBookingDto {
    const dto = new GetBookingDto();
    dto.id = booking._id.toString();
    dto.eventId = booking.eventId.toString();
    dto.seats = booking.seats;
    dto.status = booking.status;
    dto.createdAt = booking.createdAt?.toISOString();
    dto.updatedAt = booking.updatedAt?.toISOString();
    dto.cancelledAt = booking.cancelledAt?.toISOString();

    const attendee = booking.attendeeId as UserDocument | Types.ObjectId;
    dto.attendee = {
      id:
        attendee instanceof Types.ObjectId
          ? attendee.toString()
          : attendee._id.toString(),
      email: attendee instanceof Types.ObjectId ? undefined : attendee.email,
      displayName:
        attendee instanceof Types.ObjectId
          ? undefined
          : (attendee as UserDocument & { displayName?: string }).displayName,
    };

    return dto;
  }

  private ensureValidSeatCount(value: number): number {
    if (!Number.isFinite(value) || value <= 0) {
      throw new BadRequestException("Il numero di posti deve essere positivo");
    }
    return Math.trunc(value);
  }

  private toObjectId(value: string, label: string): Types.ObjectId {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`Identificativo ${label} non valido`);
    }
    return new Types.ObjectId(value);
  }

  private normalizePage(value?: number | string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return this.DEFAULT_PAGE;
    }
    return Math.trunc(parsed);
  }

  private normalizePageSize(value?: number | string): number {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 1) {
      return this.DEFAULT_PAGE_SIZE;
    }
    return Math.min(Math.trunc(parsed), this.MAX_PAGE_SIZE);
  }

  private calculateAvailableSeats(event: EventDocument): number {
    return Math.max(event.maxParticipants - event.reservedSeats, 0);
  }

  private createEmptyBookingsResponse(
    event: EventDocument,
    page: number,
    pageSize: number
  ): EventBookingsResponseDto {
    const response = new EventBookingsResponseDto();
    response.eventId = event._id.toString();
    response.items = [];
    response.page = page;
    response.pageSize = pageSize;
    response.total = 0;
    response.availableSeats = this.calculateAvailableSeats(event);
    return response;
  }
}

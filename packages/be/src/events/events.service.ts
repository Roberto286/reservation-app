import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  CreateEventDto,
  EventCategory,
  GetEventDto,
  GetEventsDto,
  UpdateEventDto,
} from "@reservation-app/shared";
import type { Model } from "mongoose";
import type { EventDocument } from "src/schemas/event.schema";
import { Event } from "src/schemas/event.schema";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {}

  private filterOutPastOrFullyBookedEvents(
    events: EventDocument[]
  ): EventDocument[] {
    const now = new Date();
    return events.filter(
      (event) =>
        event.startAt > now && event.reservedSeats < event.maxParticipants
    );
  }

  private mapEntitiesToDto(events: EventDocument[]): GetEventsDto {
    return events.map((event) => this.mapEntityToDto(event));
  }

  async getEvents(): Promise<GetEventsDto> {
    const events: EventDocument[] = await this.eventModel.find();

    return this.mapEntitiesToDto(this.filterOutPastOrFullyBookedEvents(events));
  }

  private mapEntityToDto(event: EventDocument): GetEventDto {
    const dto = new GetEventDto();
    dto.id = event._id.toString();
    dto.title = event.title;
    dto.description = event.description;
    dto.location = event.location;
    dto.startAt = event.startAt.toISOString();
    dto.endAt = event.endAt.toISOString();
    dto.maxParticipants = event.maxParticipants;
    dto.reservedSeats = event.reservedSeats;
    dto.category = event.category;
    dto.tags = event.tags ?? [];
    dto.updatedAt = event.updatedAt.toISOString();
    return dto;
  }

  async getEventsByCategory(category: EventCategory): Promise<GetEventsDto> {
    const events = await this.eventModel.find({
      category,
    });

    return this.mapEntitiesToDto(this.filterOutPastOrFullyBookedEvents(events));
  }

  getCategories() {
    return Object.values(EventCategory);
  }

  createEvent(body: CreateEventDto): Promise<EventDocument> {
    const event = new this.eventModel(body);
    return event.save();
  }

  async updateEvent(id: string, body: UpdateEventDto): Promise<GetEventDto> {
    const event = await this.eventModel.findById(id).exec();

    if (!event) {
      throw new NotFoundException(`Event with id ${id} not found`);
    }

    // Valida che maxParticipants non sia minore dei posti già prenotati
    if (
      body.maxParticipants !== undefined &&
      body.maxParticipants < event.reservedSeats
    ) {
      throw new BadRequestException(
        `Il numero massimo di partecipanti (${body.maxParticipants}) non può essere inferiore ai posti già prenotati (${event.reservedSeats})`
      );
    }

    Object.assign(event, body);
    const updatedEvent = await event.save();

    return this.mapEntityToDto(updatedEvent);
  }

  deleteEvent(id: string) {
    return this.eventModel.findByIdAndDelete(id).exec();
  }

  async getUnavailableEvents(category?: EventCategory): Promise<GetEventsDto> {
    const filter = category ? { category } : {};
    const events: EventDocument[] = await this.eventModel.find(filter);
    const now = new Date();
    const unavailableEvents = events.filter(
      (event) =>
        event.startAt <= now || event.reservedSeats >= event.maxParticipants
    );

    return this.mapEntitiesToDto(unavailableEvents);
  }
}

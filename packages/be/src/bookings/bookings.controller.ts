import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import {
  CreateBookingDto,
  EventBookingsQueryDto,
  EventBookingsResponseDto,
  GetBookingDto,
  UpdateBookingDto,
} from "@reservation-app/shared";
import { AuthGuard } from "src/auth/auth.guard";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
import { BookingsService } from "./bookings.service";

@Controller("bookings")
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Patch(":bookingId")
  updateBooking(
    @Param("bookingId") bookingId: string,
    @Body() body: UpdateBookingDto,
    @Req() request: AuthenticatedRequest
  ): Promise<GetBookingDto> {
    const userId = request.user?.sub ?? ""; // è safe dato che c'è l'AuthGuard

    if (!userId) {
      throw new UnauthorizedException("Token non valido");
    }

    return this.bookingsService.updateBooking(bookingId, body, userId);
  }

  @Post(":bookingId/cancel")
  cancelBooking(
    @Param("bookingId") bookingId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<GetBookingDto> {
    const userId = request.user?.sub ?? ""; // è safe dato che c'è l'AuthGuard

    if (!userId) {
      throw new UnauthorizedException("Token non valido");
    }

    return this.bookingsService.cancelBooking(bookingId, userId);
  }

  @Get()
  getEventBookings(
    @Param("eventId") eventId: string,
    @Query() query: EventBookingsQueryDto
  ): Promise<EventBookingsResponseDto> {
    return this.bookingsService.getEventBookings(eventId, query);
  }

  @Post(":eventId")
  createBooking(
    @Param("eventId") eventId: string,
    @Body() body: CreateBookingDto,
    @Req() request: AuthenticatedRequest
  ): Promise<GetBookingDto> {
    const userId = request.user?.sub ?? ""; // è safe dato che c'è l'AuthGuard

    if (!userId) {
      throw new UnauthorizedException("Token non valido");
    }

    return this.bookingsService.createBooking(eventId, body, userId);
  }

  @Get(":attendeeId")
  getBookingsByAttendee(
    @Param("attendeeId") attendeeId: string
  ): Promise<GetBookingDto[]> {
    return this.bookingsService.getBookingsByAttendee(attendeeId);
  }

  @Delete(":bookingId")
  deleteBooking(
    @Param("bookingId") bookingId: string,
    @Req() request: AuthenticatedRequest
  ): Promise<{ deletedCount?: number }> {
    const userId = request.user?.sub ?? ""; // è safe dato che c'è l'AuthGuard

    if (!userId) {
      throw new UnauthorizedException("Token non valido");
    }

    return this.bookingsService.deleteBooking(bookingId, userId);
  }
}

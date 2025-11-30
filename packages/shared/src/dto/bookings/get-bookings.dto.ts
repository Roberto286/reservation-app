import type { BookingStatusDto } from "./booking-status";

export class BookingAttendeeDto {
  id!: string;
  email?: string;
  displayName?: string;
}

export class BookingEventDetailDto {
  title!: string;
  location?: string;
  startAt!: string;
}

export class GetBookingDto {
  id!: string;
  eventId!: string;
  eventDetail?: BookingEventDetailDto;
  attendee!: BookingAttendeeDto;
  seats!: number;
  status!: BookingStatusDto;
  note?: string;
  createdAt!: string;
  updatedAt!: string;
  cancelledAt?: string;
}

export class EventBookingsQueryDto {
  status?: BookingStatusDto;
  attendeeEmail?: string;
  page?: number;
  pageSize?: number;
}

export class EventBookingsResponseDto {
  eventId!: string;
  items!: GetBookingDto[];
  total!: number;
  page!: number;
  pageSize!: number;
  availableSeats!: number;
}

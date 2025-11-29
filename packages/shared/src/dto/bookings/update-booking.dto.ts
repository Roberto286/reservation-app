import type { BookingStatusDto } from "./booking-status";

export class UpdateBookingDto {
  seats?: number;
  status?: BookingStatusDto;
  note?: string;
}

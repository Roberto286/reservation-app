import { IsOptional, IsPositive, IsString } from "class-validator";
import type { BookingStatusDto } from "./booking-status";

export class UpdateBookingDto {
  @IsOptional()
  @IsPositive()
  seats?: number;

  @IsOptional()
  status?: BookingStatusDto;

  @IsOptional()
  @IsString()
  note?: string;
}

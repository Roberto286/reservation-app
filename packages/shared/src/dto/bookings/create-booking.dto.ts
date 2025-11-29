import { IsOptional, IsPositive } from "class-validator";

export class CreateBookingDto {
  @IsPositive()
  seats!: number;
  @IsOptional()
  attendeeId?: string;
}

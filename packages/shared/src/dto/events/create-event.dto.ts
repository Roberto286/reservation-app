import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  MinDate,
} from "class-validator";
import { EventCategory } from "../../event-category";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  @MinDate(() => new Date(), { message: "startAt deve essere nel futuro" })
  startAt!: string;

  @IsDateString()
  @MinDate(new Date(), { message: "endAt deve essere nel futuro" })
  endAt!: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsInt()
  @IsPositive()
  maxParticipants!: number;

  @IsEnum(EventCategory)
  category!: EventCategory;
}

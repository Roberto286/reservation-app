import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { FutureDate } from "class-validator-extended";
import { EventCategory } from "../../event-category";

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @Type(() => Date)
  @IsDate()
  @FutureDate()
  startAt!: Date;

  @Type(() => Date)
  @IsDate()
  @FutureDate()
  endAt!: Date;

  @IsString()
  location!: string;

  @IsInt()
  @IsPositive()
  maxParticipants!: number;

  @IsEnum(EventCategory)
  category!: EventCategory;
}

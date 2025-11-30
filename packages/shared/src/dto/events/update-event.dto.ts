import { Type } from "class-transformer";
import {
  IsDate,
  IsEnum,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";
import { FutureDate } from "class-validator-extended";
import { EventCategory } from "../../event-category";

export class UpdateEventDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @FutureDate()
  startAt?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @FutureDate()
  endAt?: Date;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  maxParticipants?: number;

  @IsOptional()
  @IsEnum(EventCategory)
  category?: EventCategory;
}

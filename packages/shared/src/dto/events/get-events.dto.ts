import { EventCategory } from "../../event-category";
export class GetEventDto {
  id!: string;
  title!: string;
  description?: string;
  location?: string;
  startAt!: string;
  endAt!: string;
  maxParticipants!: number;
  reservedSeats!: number;
  category!: EventCategory;
  organizerEmail!: string;
  tags!: string[];
  updatedAt!: string;
}

export type GetEventsDto = GetEventDto[];

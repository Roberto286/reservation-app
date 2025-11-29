import { EventCategory } from "../../event-category";

export class EventOrganizerDto {
  email!: string;
}

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
  organizer!: EventOrganizerDto;
  tags!: string[];
}

export type GetEventsDto = GetEventDto[];

import { EventCategory } from "../../event-category";
export type EventStatusDto = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

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
  status!: EventStatusDto;
  category!: EventCategory;
  organizer!: EventOrganizerDto;
  tags!: string[];
}

export type GetEventsDto = GetEventDto[];

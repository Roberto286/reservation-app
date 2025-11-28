import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  CreateEventDto,
  EventCategory,
  GetEventDto,
  type GetEventsDto,
} from "@reservation-app/shared";
import type { Model } from "mongoose";
import type { EventDocument } from "src/schemas/event.schema";
import { Event } from "src/schemas/event.schema";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {}

  private mapEntitiesToDto(events: EventDocument[]): GetEventsDto {
    return events.map((event) => this.mapEntityToDto(event));
  }

  private mapEntityToDto(event: EventDocument): GetEventDto {
    const dto = new GetEventDto();
    dto.id = event._id.toString();
    dto.title = event.title;
    dto.description = event.description;
    dto.location = event.location;
    dto.startAt = event.startAt.toISOString();
    dto.endAt = event.endAt.toISOString();
    dto.maxParticipants = event.maxParticipants;
    dto.reservedSeats = event.reservedSeats;
    dto.status = event.status;
    dto.category = event.category;
    dto.tags = event.tags ?? [];
    return dto;
  }

  async getEventsByCategory(category: EventCategory): Promise<GetEventsDto> {
    const events = await this.eventModel.find({
      category,
    });
    return this.mapEntitiesToDto(events);
  }

  getCategories() {
    return Object.values(EventCategory);
  }

  createEvent(body: CreateEventDto): Promise<EventDocument> {
    const event = new this.eventModel(body);
    return event.save();
  }
}

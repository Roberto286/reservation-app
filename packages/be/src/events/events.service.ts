import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
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
    const eventDtos = events.map(() => {
      return new GetEventDto();
    });

    return eventDtos;
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
}

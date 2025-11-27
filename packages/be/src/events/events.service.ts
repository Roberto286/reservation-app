import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {
  EventCategory,
  GetEventDto,
  GetEventsDto,
} from "@reservation-app/shared";
import { Model } from "mongoose";
import { EventDocument } from "src/schemas/event.schema";

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<EventDocument>
  ) {}

  private mapEntitiesToDto(events: EventDocument[]): GetEventsDto {
    const eventDtos = events.map((event) => {
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

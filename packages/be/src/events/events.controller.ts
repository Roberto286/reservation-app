import { Controller, Get, Param } from "@nestjs/common";
import { EventCategory, GetEventsDto } from "@reservation-app/shared";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get("categories")
  getCategories() {
    return this.eventsService.getCategories();
  }

  @Get("/:category")
  getEventsByCategory(
    @Param("category") category: EventCategory
  ): Promise<GetEventsDto> {
    return this.eventsService.getEventsByCategory(category);
  }
}

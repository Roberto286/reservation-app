import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import type { EventCategory, GetEventsDto } from "@reservation-app/shared";
import { CreateEventDto } from "@reservation-app/shared";
import { AuthGuard } from "src/auth/auth.guard";
import { EventsService } from "./events.service";

@Controller("events")
@UseGuards(AuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get("")
  getAllEvents(): Promise<GetEventsDto> {
    return this.eventsService.getEvents();
  }

  @Post("")
  createEvent(@Body() body: CreateEventDto) {
    this.eventsService.createEvent(body);
  }

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

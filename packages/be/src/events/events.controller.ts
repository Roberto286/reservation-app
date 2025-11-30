import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import {
  CreateEventDto,
  EventCategory,
  GetEventsDto,
  UpdateEventDto,
} from "@reservation-app/shared";
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

  @Put("/:id")
  updateEvent(@Param("id") id: string, @Body() body: UpdateEventDto) {
    console.log("body :>> ", body);
    return this.eventsService.updateEvent(id, body);
  }

  @Delete("/:id")
  deleteEvent(@Param("id") id: string) {
    return this.eventsService.deleteEvent(id);
  }
}

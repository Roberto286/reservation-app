import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import {
  CreateEventDto,
  EventCategory,
  GetEventsDto,
  UpdateEventDto,
  UserRole,
} from "@reservation-app/shared";
import { AuthGuard } from "src/auth/auth.guard";
import { Roles } from "src/auth/roles.decorator";
import { RolesGuard } from "src/auth/roles.guard";
import { EventsService } from "./events.service";

@Controller("events")
@UseGuards(AuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get("")
  getAllEvents(): Promise<GetEventsDto> {
    return this.eventsService.getEvents();
  }

  @Post("")
  @Roles(UserRole.Admin)
  createEvent(@Body() body: CreateEventDto) {
    this.eventsService.createEvent(body);
  }

  @Get("categories")
  getCategories() {
    return this.eventsService.getCategories();
  }

  @Get("unavailable")
  getUnavailableEvents(
    @Query("category") category?: EventCategory
  ): Promise<GetEventsDto> {
    return this.eventsService.getUnavailableEvents(category);
  }

  @Get("/:category")
  getEventsByCategory(
    @Param("category") category: EventCategory
  ): Promise<GetEventsDto> {
    return this.eventsService.getEventsByCategory(category);
  }

  @Put("/:id")
  @Roles(UserRole.Admin)
  updateEvent(@Param("id") id: string, @Body() body: UpdateEventDto) {
    return this.eventsService.updateEvent(id, body);
  }

  @Delete("/:id")
  @Roles(UserRole.Admin)
  deleteEvent(@Param("id") id: string) {
    return this.eventsService.deleteEvent(id);
  }
}

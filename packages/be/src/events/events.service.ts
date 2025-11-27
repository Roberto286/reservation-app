import { Injectable } from "@nestjs/common";
import { EventCategory } from "src/schemas/event.schema";

@Injectable()
export class EventsService {
  getCategories() {
    return Object.values(EventCategory);
  }
}

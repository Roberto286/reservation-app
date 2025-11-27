import { Injectable } from "@nestjs/common";
import { EventCategory } from "@reservation-app/shared";

@Injectable()
export class EventsService {
  getCategories() {
    return Object.values(EventCategory);
  }
}

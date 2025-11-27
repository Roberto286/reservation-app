import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { EventCategory, GetEventsDto } from '@reservation-app/shared';
import { EventsMenu } from '../../components/events-menu/events-menu';
import { Button } from '../../components/button/button';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [],
  imports: [EventsMenu, Button],
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  events: GetEventsDto | null = null;

  onCategorySelected(category: EventCategory | null) {
    this.http.get<GetEventsDto>(`/events/${category}`).subscribe((events) => {
      console.log('Events for category', category, events);
      this.events = events;
    });
  }
}

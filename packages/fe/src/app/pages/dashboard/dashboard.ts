import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { EventCategory, GetEventsDto } from '@reservation-app/shared';
import { Button } from '../../components/button/button';
import { EventForm } from '../../components/event-form/event-form';
import { EventsMenu } from '../../components/events-menu/events-menu';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [],
  imports: [EventsMenu, Button, Modal, EventForm],
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  events: GetEventsDto | null = null;
  showModal = signal(false);
  categories = signal<EventCategory[]>([]);

  constructor() {
    this.http.get<EventCategory[]>('/events/categories').subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  onCategorySelected(category: EventCategory | null) {
    this.http.get<GetEventsDto>(`/events/${category}`).subscribe((events) => {
      console.log('Events for category', category, events);
      this.events = events;
    });
  }

  onNewEvent() {
    this.showModal.set(true);
  }
}

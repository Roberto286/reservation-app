import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { EventCategory, GetEventsDto } from '@reservation-app/shared';
import { Button } from '../../components/button/button';
import { EventCard } from '../../components/event-card/event-card';
import { EventForm } from '../../components/event-form/event-form';
import { EventsMenu } from '../../components/events-menu/events-menu';
import { Modal } from '../../components/modal/modal';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [],
  imports: [EventsMenu, Button, Modal, EventForm, CommonModule, EventCard],
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  events = signal<GetEventsDto>([]);
  showModal = signal(false);
  categories = signal<EventCategory[]>([]);

  constructor() {
    this.http.get<EventCategory[]>('/events/categories').subscribe((categories) => {
      this.categories.set(categories);
    });

    this.fetchEvents();
  }

  private fetchEvents(category?: EventCategory) {
    this.http.get<GetEventsDto>(`/events/${category ?? ''}`).subscribe((events) => {
      this.events.set(events);
    });
  }

  onCategorySelected(category: EventCategory | null) {
    this.fetchEvents(category ?? undefined);
  }

  onNewEvent() {
    this.showModal.set(true);
  }

  onNewEventCreated() {
    this.fetchEvents();
  }
}

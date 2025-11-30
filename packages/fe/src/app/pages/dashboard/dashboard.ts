import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCategory, GetEventDto, GetEventsDto } from '@reservation-app/shared';
import { Button } from '../../components/button/button';
import { EventCard } from '../../components/event-card/event-card';
import { EventForm } from '../../components/event-form/event-form';
import { EventsMenu } from '../../components/events-menu';
import { Modal } from '../../components/modal/modal';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [],
  imports: [EventsMenu, Button, Modal, EventForm, CommonModule, EventCard, FormsModule],
})
export class Dashboard {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthStateService);
  protected events = signal<GetEventsDto>([]);
  protected showModal = signal(false);
  protected categories = signal<EventCategory[]>([]);
  protected isAdmin = this.authService.getUserRole().toLowerCase() === 'admin';
  protected readonly eventData = signal<GetEventDto | null>(null);
  protected isEditing = computed(() => this.eventData() !== null);

  protected dateFilter = signal<string>('');
  protected availabilityFilter = signal<string>('all');
  protected sortOrder = signal<string>('date-asc');

  protected filteredEvents = computed(() => {
    let result = [...this.events()];

    if (this.dateFilter()) {
      const filterDate = new Date(this.dateFilter());
      result = result.filter((event) => {
        const eventDate = new Date(event.startAt);
        return (
          eventDate.getFullYear() === filterDate.getFullYear() &&
          eventDate.getMonth() === filterDate.getMonth() &&
          eventDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (this.availabilityFilter() === 'available') {
      result = result.filter((event) => event.reservedSeats < event.maxParticipants);
    } else if (this.availabilityFilter() === 'full') {
      result = result.filter((event) => event.reservedSeats >= event.maxParticipants);
    }

    const sortOrder = this.sortOrder();
    if (sortOrder === 'date-asc') {
      result.sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
    } else if (sortOrder === 'date-desc') {
      result.sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
    } else if (sortOrder === 'availability') {
      result.sort((a, b) => {
        const aAvailable = a.maxParticipants - a.reservedSeats;
        const bAvailable = b.maxParticipants - b.reservedSeats;
        return bAvailable - aAvailable;
      });
    }

    return result;
  });

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
    this.eventData.set(null);
    this.showModal.set(true);
  }

  onNewEventCreated() {
    this.fetchEvents();
  }

  onEventBooked() {
    this.fetchEvents();
  }

  onEditEvent($event: GetEventDto) {
    this.eventData.set($event);
    this.showModal.set(true);
  }

  onDateFilterChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dateFilter.set(target.value);
  }

  onAvailabilityFilterChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.availabilityFilter.set(target.value);
  }

  onSortOrderChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.sortOrder.set(target.value);
  }

  clearFilters() {
    this.dateFilter.set('');
    this.availabilityFilter.set('all');
    this.sortOrder.set('date-asc');
  }
}

import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventCategory, GetBookingDto, GetEventDto, GetEventsDto } from '@reservation-app/shared';
import { Button } from '../../components/button/button';
import { EventCard } from '../../components/event-card/event-card';
import { EventForm } from '../../components/event-form/event-form';
import { EventsMenu } from '../../components/events-menu';
import { Modal } from '../../components/modal/modal';
import { Paginator } from '../../components/paginator/paginator';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styles: [],
  imports: [EventsMenu, Button, Modal, EventForm, CommonModule, EventCard, FormsModule, Paginator],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  protected userBookings = signal<GetBookingDto[]>([]);

  protected dateFilter = signal<string>('');
  protected availabilityFilter = signal<string>('all');
  protected sortOrder = signal<string>('date-asc');

  // Pagination
  protected currentPage = signal<number>(1);
  protected itemsPerPage = signal<number>(8);

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

  protected paginatedEvents = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage();
    const end = start + this.itemsPerPage();
    return this.filteredEvents().slice(start, end);
  });

  protected totalPages = computed(() => {
    const filtered = this.filteredEvents().length;
    const perPage = this.itemsPerPage();
    if (filtered === 0 || perPage === 0) return 1;
    return Math.ceil(filtered / perPage);
  });

  unavailableEvents = signal<GetEventsDto>([]);

  constructor() {
    this.http.get<EventCategory[]>('/events/categories').subscribe((categories) => {
      this.categories.set(categories);
    });

    this.fetchEvents();
    if (!this.isAdmin) {
      const userId = this.authService.getUserId();
      this.http.get<GetBookingDto[]>(`/bookings/${userId}`).subscribe((bookings) => {
        this.userBookings.set(bookings);
      });
    }
  }

  private fetchEvents(category?: EventCategory) {
    const url = category ? `/events/${category}` : '/events';
    this.http.get<GetEventsDto>(url).subscribe((events) => {
      this.events.set(events);
    });
    this.fetchUnavailableEvents(category);
  }

  private fetchUnavailableEvents(category?: EventCategory) {
    const url = category ? `/events/unavailable?category=${category}` : '/events/unavailable';
    this.http.get<GetEventsDto>(url).subscribe((events) => {
      this.unavailableEvents.set(events);
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
    // Ricarica le userBookings dopo una prenotazione
    if (!this.isAdmin) {
      this.http.get<GetBookingDto[]>('/bookings/user').subscribe((bookings) => {
        this.userBookings.set(bookings);
      });
    }
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
    this.currentPage.set(1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}

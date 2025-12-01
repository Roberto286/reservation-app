import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import type { GetBookingDto, GetEventDto } from '@reservation-app/shared';
import { EVENT_CATEGORY_LABELS } from '@reservation-app/shared';
import { AuthStateService } from '../../core/services/auth-state.service';
import { BookingsService } from '../../core/services/bookings.service';
import { Button } from '../button/button';

// Formatter statico condiviso per tutte le istanze
const dateFormatter = new Intl.DateTimeFormat('it-IT', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule, Button],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  private readonly bookingsService = inject(BookingsService);
  private readonly authService = inject(AuthStateService);
  readonly eventData = input.required<GetEventDto>();
  readonly eventBooked = output<void>();
  protected readonly bookingState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  protected readonly bookingError = signal<string | null>(null);
  protected readonly selectedSeats = signal<number>(1);
  protected readonly isAdmin = this.authService.getUserRole().toLowerCase() === 'admin';
  readonly userBookings = input<GetBookingDto[]>([]);
  isEditing = output<GetEventDto>();
  unavailable = input<boolean>(false);

  protected readonly hasAlreadyBooked = computed(() => {
    return this.bookingsService.hasUserBookedEvent(this.eventData().id, this.userBookings());
  });

  protected readonly isUpcoming = computed(() => {
    const start = new Date(this.eventData().startAt).getTime();
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    return start >= now && start <= weekFromNow;
  });

  protected readonly eventDates = computed(() => {
    const eventValue = this.eventData();
    return {
      start: dateFormatter.format(new Date(eventValue.startAt)),
      end: dateFormatter.format(new Date(eventValue.endAt)),
      updatedAt: dateFormatter.format(new Date(eventValue.updatedAt)),
    };
  });

  protected readonly availableSeats = computed(() => {
    const eventValue = this.eventData();
    return Math.max(eventValue.maxParticipants - eventValue.reservedSeats, 0);
  });

  protected readonly locationLabel = computed(() => {
    const location = this.eventData().location?.trim();
    return location?.length ? location : 'Luogo da definire';
  });

  protected readonly organizerEmail = computed(() => {
    return this.eventData().organizerEmail ?? 'Anonimo';
  });

  protected readonly tags = computed(() => this.eventData().tags ?? []);

  protected readonly categoryLabel = computed(() => {
    return EVENT_CATEGORY_LABELS[this.eventData().category];
  });

  protected readonly truncatedDescription = computed(() => {
    const description = this.eventData().description?.trim();
    if (!description) return '';
    const maxLength = 150;
    return description.length > maxLength
      ? description.substring(0, maxLength) + '...'
      : description;
  });

  protected readonly canBook = computed(
    () =>
      this.bookingsService.canBook(this.eventData(), this.bookingState()) &&
      !this.isAdmin &&
      !this.hasAlreadyBooked()
  );

  protected readonly seatsOptions = computed(() => {
    const available = this.availableSeats();
    return Array.from({ length: available }, (_, i) => i + 1);
  });

  bookSeats() {
    if (!this.canBook()) {
      return;
    }

    this.bookingsService.bookSeats(this.eventData().id, this.selectedSeats(), {
      onStateChange: (state) => {
        this.bookingState.set(state);
        this.eventBooked.emit();
      },
      onErrorMessage: (message) => this.bookingError.set(message),
    });
  }

  onSeatsChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSeats.set(Number.parseInt(selectElement.value, 10));
  }

  onEditEvent() {
    this.isEditing.emit(this.eventData());
  }
}

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
import type { GetEventDto } from '@reservation-app/shared';
import { EVENT_CATEGORY_LABELS } from '@reservation-app/shared';
import { BookingsService } from '../../core/services/bookings.service';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './event-card.html',
  styleUrl: './event-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCard {
  readonly eventData = input.required<GetEventDto>();
  private readonly bookingsService = inject(BookingsService);
  readonly eventBooked = output<void>();
  protected readonly bookingState = signal<'idle' | 'loading' | 'success' | 'error'>('idle');
  protected readonly bookingError = signal<string | null>(null);
  protected readonly selectedSeats = signal<number>(1);

  protected readonly isUpcoming = computed(() => {
    const start = new Date(this.eventData().startAt).getTime();
    const now = Date.now();
    const weekFromNow = now + 7 * 24 * 60 * 60 * 1000;
    return start >= now && start <= weekFromNow;
  });

  protected readonly eventDates = computed(() => {
    const eventValue = this.eventData();
    const formatter = new Intl.DateTimeFormat('it-IT', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    return {
      start: formatter.format(new Date(eventValue.startAt)),
      end: formatter.format(new Date(eventValue.endAt)),
      updatedAt: formatter.format(new Date(eventValue.updatedAt)),
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
    return this.eventData().organizer?.email ?? 'organizer@unknown.dev';
  });

  protected readonly tags = computed(() => this.eventData().tags ?? []);

  protected readonly categoryLabel = computed(() => {
    return EVENT_CATEGORY_LABELS[this.eventData().category];
  });

  protected readonly placeholderImage = 'https://placehold.co/384x192/png';

  protected readonly canBook = computed(() =>
    this.bookingsService.canBook(this.eventData(), this.bookingState())
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
}

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import type { GetEventDto } from '@reservation-app/shared';

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

  protected readonly placeholderImage = 'https://placehold.co/384x192/png';

  protected readonly statusBadgeColor = computed(() => {
    const status = this.eventData().status;
    switch (status) {
      case 'PUBLISHED':
        return 'badge-success';
      case 'CANCELLED':
        return 'badge-error';
      case 'COMPLETED':
        return 'badge-neutral';
      default:
        return 'badge-warning';
    }
  });
}

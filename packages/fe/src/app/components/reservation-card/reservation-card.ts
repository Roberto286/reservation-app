import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';
import { AlertService } from '../../core/services/alert.service';
import { Button } from '../button/button';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-reservation-card',
  imports: [DatePipe, CommonModule, Button, Modal],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  private readonly http = inject(HttpClient);
  private readonly alertService = inject(AlertService);
  reservationData = input.required<GetBookingDto>();
  isOutdated = input<boolean>(true);
  openConfirmCancelationModal = signal(false);
  openEditModal = signal(false);
  newSeats = signal(0);
  askForFetch = output<void>();

  // Calcola i posti totali disponibili per questa prenotazione
  // (posti disponibili dell'evento + i posti già prenotati dall'utente)
  maxAvailableSeats = computed(() => {
    const eventDetail = this.reservationData().eventDetail;
    if (!eventDetail) return 1;
    const available = eventDetail.maxParticipants - eventDetail.reservedSeats;
    return available + this.reservationData().seats;
  });

  onCancel() {
    this.openConfirmCancelationModal.set(true);
  }

  onConfirmCancel() {
    this.http
      .delete<{ deletedCount?: number }>(`/bookings/${this.reservationData().id}`)
      .subscribe({
        next: () => {
          this.alertService.success('Prenotazione cancellata con successo!');
          this.openConfirmCancelationModal.set(false);
          this.askForFetch.emit();
        },
        error: () => {
          this.alertService.error('Errore durante la cancellazione della prenotazione.');
        },
      });
  }

  onEdit() {
    this.newSeats.set(this.reservationData().seats);
    this.openEditModal.set(true);
  }

  incrementSeats() {
    if (this.newSeats() < this.maxAvailableSeats()) {
      this.newSeats.update((seats) => seats + 1);
    }
  }

  decrementSeats() {
    if (this.newSeats() > 1) {
      this.newSeats.update((seats) => seats - 1);
    }
  }

  onSeatsChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    const max = this.maxAvailableSeats();
    if (!Number.isNaN(value) && value >= 1) {
      this.newSeats.set(Math.min(value, max));
    } else if ((event.target as HTMLInputElement).value === '') {
      this.newSeats.set(1);
    }
  }

  onConfirmEdit() {
    this.openEditModal.set(false);
    this.http
      .patch(`/bookings/${this.reservationData().id}`, { seats: this.newSeats() })
      .subscribe({
        next: () => {
          this.alertService.success('Prenotazione modificata con successo!');
          this.askForFetch.emit();
        },
        error: () => {
          this.alertService.error('Errore durante la modifica della prenotazione.');
        },
      });
  }
}

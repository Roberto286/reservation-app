import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, input, output, signal } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';
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
  reservationData = input.required<GetBookingDto>();
  openConfirmCancelationModal = signal(false);
  openEditModal = signal(false);
  newSeats = signal(0);
  askForFetch = output<void>();

  onCancel() {
    this.openConfirmCancelationModal.set(true);
  }

  onConfirmCancel() {
    this.http
      .delete<{ deletedCount?: number }>(`/bookings/${this.reservationData().id}`)
      .subscribe({
        next: (response) => {
          console.log('Prenotazione cancellata:', response);
          this.openConfirmCancelationModal.set(false);
          this.askForFetch.emit();
        },
        error: (error) => {
          console.error('Errore durante la cancellazione della prenotazione:', error);
        },
      });
  }

  onEdit() {
    this.newSeats.set(this.reservationData().seats);
    this.openEditModal.set(true);
  }

  incrementSeats() {
    this.newSeats.update((seats) => seats + 1);
  }

  decrementSeats() {
    if (this.newSeats() > 1) {
      this.newSeats.update((seats) => seats - 1);
    }
  }

  onSeatsChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!Number.isNaN(value) && value >= 1) {
      this.newSeats.set(value);
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
          this.askForFetch.emit();
        },
        error: (error) => {
          console.error('Errore durante la modifica della prenotazione:', error);
        },
      });
  }
}

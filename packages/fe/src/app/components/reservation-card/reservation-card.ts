import { CommonModule, DatePipe } from '@angular/common';
import { Component, computed, inject, input, output } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';
import { ModalService } from '../../core/services/modal.service';
import { Button } from '../button/button';
import { CancelBookingModal, type CancelBookingModalData } from '../modals/cancel-booking-modal';
import { EditBookingModal, type EditBookingModalData } from '../modals/edit-booking-modal';

@Component({
  selector: 'app-reservation-card',
  imports: [DatePipe, CommonModule, Button],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  private readonly modalService = inject(ModalService);
  reservationData = input.required<GetBookingDto>();
  isOutdated = input<boolean>(true);
  askForFetch = output<void>();
  unavailable = input(false);
  availableSeats = computed(() => {
    const eventDetail = this.reservationData().eventDetail;
    if (!eventDetail) return 0;
    return eventDetail.maxParticipants - eventDetail.reservedSeats;
  });

  // Verifica se l'evento è scaduto (data passata)
  isEventExpired = computed(() => {
    const eventDetail = this.reservationData().eventDetail;
    if (!eventDetail) return false;
    return new Date(eventDetail.startAt) < new Date();
  });

  // Calcola i posti totali disponibili per questa prenotazione
  // (posti disponibili dell'evento + i posti già prenotati dall'utente)
  maxAvailableSeats = computed(() => {
    const eventDetail = this.reservationData().eventDetail;
    if (!eventDetail) return 1;
    const available = eventDetail.maxParticipants - eventDetail.reservedSeats;
    return available + this.reservationData().seats;
  });

  onCancel(): void {
    const data: CancelBookingModalData = {
      bookingId: this.reservationData().id,
      onSuccess: () => this.askForFetch.emit(),
    };
    this.modalService.open(CancelBookingModal, data);
  }

  onEdit(): void {
    const data: EditBookingModalData = {
      bookingId: this.reservationData().id,
      currentSeats: this.reservationData().seats,
      maxAvailableSeats: this.maxAvailableSeats(),
      onSuccess: () => this.askForFetch.emit(),
    };
    this.modalService.open(EditBookingModal, data);
  }
}

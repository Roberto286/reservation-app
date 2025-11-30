import { CommonModule, DatePipe } from '@angular/common';
import { Component, input, signal } from '@angular/core';
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
  reservationData = input.required<GetBookingDto>();
  openModal = signal(false);

  onCancel() {
    this.openModal.set(true);
  }
}

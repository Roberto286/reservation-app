import { CommonModule, DatePipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';

@Component({
  selector: 'app-reservation-card',
  imports: [DatePipe, CommonModule],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  reservationData = input.required<GetBookingDto>();
}

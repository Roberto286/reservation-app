import { Component, input } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';
import { EventCard } from '../event-card/event-card';

@Component({
  selector: 'app-reservation-card',
  imports: [],
  templateUrl: './reservation-card.html',
  styleUrl: './reservation-card.css',
})
export class ReservationCard {
  reservationData = input.required<GetBookingDto>();
}

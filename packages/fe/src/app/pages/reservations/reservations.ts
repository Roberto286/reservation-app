import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { GetBookingDto } from '@reservation-app/shared';
import { ReservationCard } from '../../components/reservation-card/reservation-card';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-reservations',
  imports: [ReservationCard],
  templateUrl: './reservations.html',
  styleUrl: './reservations.css',
})
export class Reservations {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthStateService);
  private readonly userId = this.authService.getUserId();
  protected reservations = signal<GetBookingDto[]>([]);
  constructor() {
    this.fetchReservations();
  }

  private fetchReservations() {
    this.http.get<GetBookingDto[]>(`/bookings/${this.userId}`).subscribe((data) => {
      this.reservations.set(data);
    });
  }
}

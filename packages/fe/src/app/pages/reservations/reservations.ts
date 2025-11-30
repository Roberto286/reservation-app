import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, signal } from '@angular/core';
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

  protected activeReservations = computed(() => {
    const now = new Date();
    return this.reservations().filter(
      (reservation) => reservation.eventDetail && new Date(reservation.eventDetail.startAt) >= now
    );
  });

  protected unavailableReservations = computed(() => {
    const now = new Date();
    return this.reservations().filter(
      (reservation) =>
        (reservation.eventDetail && new Date(reservation.eventDetail.startAt) < now) ||
        !reservation.eventId
    );
  });
  constructor() {
    this.fetchReservations();
  }

  fetchReservations() {
    this.http.get<GetBookingDto[]>(`/bookings/${this.userId}`).subscribe((data) => {
      this.reservations.set(data);
    });
  }
}

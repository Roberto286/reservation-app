import { HttpClient } from '@angular/common/http';
import { Component, effect, inject, input, signal } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { ModalService } from '../../core/services/modal.service';
import { Button } from '../button/button';

export interface EditBookingModalData {
  bookingId: string;
  currentSeats: number;
  maxAvailableSeats: number;
  onSuccess: () => void;
}

@Component({
  selector: 'app-edit-booking-modal',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Modifica Prenotazione</h2>

      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium">Numero di posti:</label>
        <div class="flex items-center gap-4 justify-center">
          <app-button
            [variant]="'accent'"
            [size]="'sm'"
            (click)="decrementSeats()"
            [disabled]="newSeats() <= 1"
          >
            -
          </app-button>
          <input
            type="number"
            [value]="newSeats()"
            (input)="onSeatsChange($event)"
            min="1"
            [max]="data().maxAvailableSeats"
            class="input input-md w-20 text-center text-2xl font-bold"
          />
          <app-button
            [variant]="'accent'"
            [size]="'sm'"
            (click)="incrementSeats()"
            [disabled]="newSeats() >= data().maxAvailableSeats"
          >
            +
          </app-button>
        </div>
      </div>

      <div class="flex gap-2 justify-end mt-4">
        <app-button [variant]="'ghost'" (click)="onCancel()">Annulla</app-button>
        <app-button [variant]="'primary'" (click)="onConfirm()">Conferma</app-button>
      </div>
    </div>
  `,
})
export class EditBookingModal {
  private readonly http = inject(HttpClient);
  private readonly modalService = inject(ModalService);
  private readonly alertService = inject(AlertService);

  data = input.required<EditBookingModalData>();
  newSeats = signal(0);

  constructor() {
    effect(() => {
      const currentData = this.data();
      if (currentData) {
        this.newSeats.set(currentData.currentSeats);
      }
    });
  }

  incrementSeats(): void {
    if (this.newSeats() >= this.data().maxAvailableSeats) {
      return;
    }
    this.newSeats.update((seats) => seats + 1);
  }

  decrementSeats(): void {
    if (this.newSeats() > 1) {
      this.newSeats.update((seats) => seats - 1);
    }
  }

  onSeatsChange(event: Event): void {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    const max = this.data().maxAvailableSeats;
    if (!Number.isNaN(value) && value >= 1) {
      this.newSeats.set(Math.min(value, max));
    } else if ((event.target as HTMLInputElement).value === '' || value <= 0) {
      this.newSeats.set(1);
    }
  }

  onCancel(): void {
    this.modalService.close();
  }

  onConfirm(): void {
    if (this.newSeats() <= 0 || this.newSeats() > this.data().maxAvailableSeats) {
      this.alertService.error('Numero di posti non valido.');
      return;
    }

    this.http.patch(`/bookings/${this.data().bookingId}`, { seats: this.newSeats() }).subscribe({
      next: () => {
        this.alertService.success('Prenotazione modificata con successo!');
        this.modalService.close();
        this.data().onSuccess();
      },
      error: () => {
        this.alertService.error('Errore durante la modifica della prenotazione.');
      },
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Component, inject, input } from '@angular/core';
import { AlertService } from '../../core/services/alert.service';
import { ModalService } from '../../core/services/modal.service';
import { Button } from '../button/button';

export interface CancelBookingModalData {
  bookingId: string;
  onSuccess: () => void;
}

@Component({
  selector: 'app-cancel-booking-modal',
  standalone: true,
  imports: [Button],
  template: `
    <div class="flex flex-col gap-4">
      <h2 class="text-xl font-bold">Conferma cancellazione</h2>
      <p>Sei sicuro di voler cancellare questa prenotazione?</p>
      <div class="flex gap-2 justify-end">
        <app-button [variant]="'accent'" (click)="onCancel()">Annulla</app-button>
        <app-button [variant]="'error'" (click)="onConfirm()">Cancella</app-button>
      </div>
    </div>
  `,
})
export class CancelBookingModal {
  private readonly http = inject(HttpClient);
  private readonly modalService = inject(ModalService);
  private readonly alertService = inject(AlertService);

  data = input.required<CancelBookingModalData>();

  onCancel(): void {
    this.modalService.close();
  }

  onConfirm(): void {
    this.http.delete<{ deletedCount?: number }>(`/bookings/${this.data().bookingId}`).subscribe({
      next: () => {
        this.alertService.success('Prenotazione cancellata con successo!');
        this.modalService.close();
        this.data().onSuccess();
      },
      error: () => {
        this.alertService.error('Errore durante la cancellazione della prenotazione.');
      },
    });
  }
}

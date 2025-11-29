import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { CreateBookingDto, type GetBookingDto, type GetEventDto } from '@reservation-app/shared';
import { defer, type Observable, of } from 'rxjs';
import { catchError, map, startWith } from 'rxjs/operators';
import { AuthStateService } from './auth-state.service';

export type BookingRequestStatus = 'loading' | 'success' | 'error';
export type BookingState = 'idle' | BookingRequestStatus;

export interface BookingRequestUpdate {
  status: BookingRequestStatus;
  message?: string;
}

export interface BookingFlowHandlers {
  onStateChange?: (state: BookingRequestStatus) => void;
  onErrorMessage?: (message: string | null) => void;
}

@Injectable({ providedIn: 'root' })
export class BookingsService {
  private readonly http = inject(HttpClient);
  private readonly authState = inject(AuthStateService);
  private readonly DEFAULT_ERROR_MESSAGE = 'Non è stato possibile completare la prenotazione.';

  canBook(
    event: Pick<GetEventDto, 'maxParticipants' | 'reservedSeats'>,
    state: BookingState = 'idle'
  ): boolean {
    const availableSeats = Math.max(event.maxParticipants - event.reservedSeats, 0);
    return availableSeats > 0 && state !== 'loading';
  }

  bookSeats(eventId: string, seats: number): Observable<BookingRequestUpdate>;
  bookSeats(
    eventId: string,
    seats: number,
    handlers: BookingFlowHandlers
  ): Observable<BookingRequestUpdate>;
  bookSeats(
    eventId: string,
    seats: number,
    handlers?: BookingFlowHandlers
  ): Observable<BookingRequestUpdate> {
    const stream = this.createBookingStream(eventId, seats);

    if (handlers) {
      stream.subscribe((update) => {
        handlers.onStateChange?.(update.status);
        if (handlers.onErrorMessage) {
          const errorMessage =
            update.status === 'error' ? update.message ?? this.DEFAULT_ERROR_MESSAGE : null;
          handlers.onErrorMessage(errorMessage);
        }
      });
    }

    return stream;
  }

  private createBookingStream(eventId: string, seats: number): Observable<BookingRequestUpdate> {
    return defer(() => {
      const userId = this.authState.getUserId();

      if (!userId) {
        return of<BookingRequestUpdate>({
          status: 'error',
          message: 'Utente non autenticato.',
        });
      }

      return this.createBooking(eventId, seats, userId).pipe(
        map(() => ({ status: 'success' } as BookingRequestUpdate)),
        catchError((error) =>
          of<BookingRequestUpdate>({
            status: 'error',
            message: this.extractErrorMessage(error),
          })
        )
      );
    }).pipe(startWith({ status: 'loading' } as BookingRequestUpdate));
  }

  private createBooking(eventId: string, seats: number, userId: string) {
    return this.http.post<GetBookingDto>(`/bookings/${eventId}`, {
      seats,
      attendeeId: userId,
    } satisfies CreateBookingDto);
  }

  private extractErrorMessage(error: unknown): string {
    if (
      error &&
      typeof error === 'object' &&
      'error' in error &&
      typeof (error as { error?: unknown }).error === 'object'
    ) {
      const payload = (error as { error?: { message?: string } }).error;
      if (payload?.message) {
        return payload.message;
      }
    }
    return this.DEFAULT_ERROR_MESSAGE;
  }
}

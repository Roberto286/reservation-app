import { Injectable, signal, Type } from '@angular/core';

export interface ModalConfig {
  component: Type<unknown>;
  data?: unknown;
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly modalConfig = signal<ModalConfig | null>(null);
  readonly currentModal = this.modalConfig.asReadonly();

  open(component: Type<unknown>, data?: unknown): void {
    this.modalConfig.set({ component, data });
  }

  close(): void {
    this.modalConfig.set(null);
  }
}

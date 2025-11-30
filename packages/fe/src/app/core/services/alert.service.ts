import { Injectable, signal } from '@angular/core';

export interface Alert {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

@Injectable({ providedIn: 'root' })
export class AlertService {
  private nextId = 0;
  readonly alerts = signal<Alert[]>([]);

  private addAlert(type: Alert['type'], message: string, duration = 5000) {
    const id = this.nextId++;
    const alert: Alert = { id, type, message };

    this.alerts.update((alerts) => [...alerts, alert]);

    if (duration > 0) {
      setTimeout(() => this.removeAlert(id), duration);
    }
  }

  info(message: string, duration = 5000) {
    this.addAlert('info', message, duration);
  }

  success(message: string, duration = 5000) {
    this.addAlert('success', message, duration);
  }

  warning(message: string, duration = 5000) {
    this.addAlert('warning', message, duration);
  }

  error(message: string, duration = 5000) {
    this.addAlert('error', message, duration);
  }

  removeAlert(id: number) {
    this.alerts.update((alerts) => alerts.filter((a) => a.id !== id));
  }
}

import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  createComponent,
  EnvironmentInjector,
  effect,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { ModalService } from '../../core/services/modal.service';

@Component({
  selector: 'app-modal-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (isOpen()) {
    <div
      class="modal modal-open fixed inset-0 z-9999"
      role="dialog"
      aria-modal="true"
      (click)="onBackdropClick($event)"
    >
      <div class="modal-box" (click)="$event.stopPropagation()">
        <ng-container #modalContent></ng-container>
      </div>
    </div>
    }
  `,
})
export class ModalContainer {
  private readonly modalService = inject(ModalService);
  private readonly injector = inject(EnvironmentInjector);

  @ViewChild('modalContent', { read: ViewContainerRef })
  modalContent!: ViewContainerRef;

  readonly currentModal = this.modalService.currentModal;
  readonly isOpen = computed(() => this.currentModal() !== null);

  constructor() {
    effect(() => {
      const modal = this.currentModal();

      // Wait for next tick to ensure ViewChild is ready
      setTimeout(() => {
        if (modal && this.modalContent) {
          this.modalContent.clear();
          const componentRef = createComponent(modal.component, {
            environmentInjector: this.injector,
            elementInjector: this.injector,
          });

          // Pass data as component input
          if (modal.data) {
            componentRef.setInput('data', modal.data);
          }

          this.modalContent.insert(componentRef.hostView);
          componentRef.changeDetectorRef.detectChanges();
        } else if (!modal && this.modalContent) {
          this.modalContent.clear();
        }
      });
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.modalService.close();
    }
  }
}

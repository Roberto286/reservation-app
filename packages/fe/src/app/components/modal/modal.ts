import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  HostListener,
  input,
  output,
} from '@angular/core';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Modal {
  readonly open = input(false);
  readonly closeOnBackdrop = input(true);
  readonly closeOnEsc = input(true);
  readonly size = input<ModalSize>('md');

  readonly closed = output<void>();

  readonly hostClasses = computed(() => ({
    modal: true,
    'modal-open': this.open(),
    'z-50': true,
  }));

  readonly modalBoxClasses = computed(() => {
    const size = this.size();
    return {
      'modal-box': true,
      'max-w-sm': size === 'sm',
      'max-w-md': size === 'md',
      'max-w-lg': size === 'lg',
      'max-w-xl': size === 'xl',
    };
  });

  onBackdropClick(event: MouseEvent) {
    if (!this.open()) {
      return;
    }

    if (event.target !== event.currentTarget) {
      return;
    }

    if (this.closeOnBackdrop()) {
      this.emitClose();
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.open() && this.closeOnEsc()) {
      this.emitClose();
    }
  }

  private emitClose() {
    this.closed.emit();
  }
}

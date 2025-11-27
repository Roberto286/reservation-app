import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'ghost'
  | 'link'
  | 'info'
  | 'success'
  | 'warning'
  | 'error';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly size = input<ButtonSize>('md');
  readonly outline = input(false);
  readonly fullWidth = input(false);
  readonly loading = input(false);
  readonly disabled = input(false);
  readonly type = input<ButtonType>('button');

  private readonly variantClasses: Record<ButtonVariant, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    neutral: 'btn-neutral',
    ghost: 'btn-ghost',
    link: 'btn-link',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
  };

  readonly buttonClasses = computed(() => {
    const variant = this.variant();
    const size = this.size();
    const classes: Record<string, boolean> = {
      [this.variantClasses[variant] ?? this.variantClasses.primary]: true,
      loading: this.loading(),
      'btn-outline': this.outline(),
      'btn-block': this.fullWidth(),
    };

    if (size !== 'md') {
      classes[`btn-${size}`] = true;
    }

    return classes;
  });

  readonly isDisabled = computed(() => this.disabled() || this.loading());
}

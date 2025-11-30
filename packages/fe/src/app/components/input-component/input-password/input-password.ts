import { Component, input, output, signal } from '@angular/core';
import { PASSWORD_REGEX } from '@reservation-app/shared';

@Component({
  selector: 'app-input-password',
  imports: [],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
})
export class InputPassword {
  readonly label = input('');
  readonly value = input('');
  readonly disabled = input(false);
  readonly placeholder = input('Password');
  readonly valueChange = output<Event>();
  readonly blur = output<void>();
  readonly onFocus = output<void>();
  capsLockOn = signal(false);
  passwordRegex = PASSWORD_REGEX;

  protected handleInput(event: Event): void {
    this.valueChange.emit(event);
  }

  checkCaps(event: KeyboardEvent) {
    this.capsLockOn.set(event.getModifierState?.('CapsLock') ?? false);
  }

  onBlur() {
    this.capsLockOn.set(false);
    this.blur.emit();
  }
}

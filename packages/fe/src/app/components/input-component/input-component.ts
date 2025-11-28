import { booleanAttribute, Component, forwardRef, input, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputEmail } from './input-email/input-email';
import { InputPassword } from './input-password/input-password';

export type InputType = 'text' | 'password' | 'email' | 'number' | 'date' | 'datetime-local';

@Component({
  selector: 'app-input-component',
  imports: [InputEmail, InputPassword],
  templateUrl: './input-component.html',
  styleUrl: './input-component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true,
    },
  ],
})
export class InputComponent implements ControlValueAccessor {
  readonly type = input<InputType>('text');
  readonly label = input('');
  readonly placeholder = input('');
  readonly helperText = input<string | null>(null);
  readonly autocomplete = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly min = input<number | null>(null);
  readonly max = input<number | null>(null);

  protected readonly value = signal('');
  protected readonly isDisabled = signal(false);

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  protected onNativeInput(event: Event): void {
    this.syncValue(this.readValue(event));
  }

  protected onCustomInput(event: Event | string): void {
    this.syncValue(this.readValue(event));
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private syncValue(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }

  private readValue(eventOrValue: Event | string): string {
    if (typeof eventOrValue === 'string') {
      return eventOrValue;
    }

    const target = eventOrValue.target as HTMLInputElement | null;
    return target?.value ?? '';
  }
}

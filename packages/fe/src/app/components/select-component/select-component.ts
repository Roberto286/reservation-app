import { booleanAttribute, Component, forwardRef, input, signal } from '@angular/core';
import { type ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type SelectOption = {
  value: string | null;
  label: string;
  disabled?: boolean;
};

@Component({
  selector: 'app-select-component',
  standalone: true,
  templateUrl: './select-component.html',
  styleUrl: './select-component.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input<string | null>(null);
  readonly helperText = input<string | null>(null);
  readonly required = input(false, { transform: booleanAttribute });
  readonly options = input<SelectOption[]>([]);

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

  protected onSelectionChange(event: Event): void {
    const next = (event.target as HTMLSelectElement | null)?.value ?? '';
    this.syncValue(next);
  }

  protected onBlur(): void {
    this.onTouched();
  }

  private syncValue(next: string): void {
    this.value.set(next);
    this.onChange(next);
  }
}

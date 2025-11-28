import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { EventCategory } from '@reservation-app/shared';
import { Button } from '../button/button';
import { InputComponent } from '../input-component/input-component';
import { SelectComponent, type SelectOption } from '../select-component/select-component';
import { TextareaComponent } from '../textarea-component/textarea-component';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventForm {
  onClose = output<void>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    dateTime: ['', Validators.required],
    category: ['', Validators.required],
    location: ['', Validators.required],
    description: [''],
  });
  categories = input<EventCategory[]>([]);

  protected readonly categoriesOptions: Signal<SelectOption[]> = computed(() =>
    this.categories().map((category) => ({
      value: category,
      label: category,
    }))
  );

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }
}

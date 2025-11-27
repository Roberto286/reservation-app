import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  Signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Button } from '../button/button';
import { InputComponent } from '../input-component/input-component';
import { SelectComponent, type SelectOption } from '../select-component/select-component';
import { TextareaComponent } from '../textarea-component/textarea-component';
import { EventCategory } from '@reservation-app/shared';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventForm {
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    dateTime: ['', Validators.required],
    category: ['', Validators.required],
    location: [''],
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

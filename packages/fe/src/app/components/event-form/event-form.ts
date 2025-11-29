import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  Signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateEventDto, EVENT_CATEGORY_LABELS, EventCategory } from '@reservation-app/shared';
import { Button } from '../button/button';
import { InputComponent } from '../input-component/input-component';
import { SelectComponent, SelectOption } from '../select-component/select-component';
import { TextareaComponent } from '../textarea-component/textarea-component';

type EventFormValue = {
  title: FormControl<string>;
  dateTime: FormControl<string>;
  category: FormControl<EventCategory>;
  location: FormControl<string>;
  maxParticipants: FormControl<number>;
  description: FormControl<string>;
};

type EventFormRawValue = {
  [K in keyof EventFormValue]: EventFormValue[K]['value'];
};

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule, Button, InputComponent, SelectComponent, TextareaComponent],
  templateUrl: './event-form.html',
  styleUrl: './event-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventForm {
  readonly categories = input<EventCategory[]>([]);
  protected readonly onClose = output<void>();
  private readonly fb = inject(FormBuilder);
  private readonly http = inject(HttpClient);
  readonly formSubmitted = output<void>();

  startingDate() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  protected readonly form: FormGroup<EventFormValue> = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    dateTime: [this.startingDate(), Validators.required],
    category: [EventCategory.Business, Validators.required],
    location: ['', Validators.required],
    maxParticipants: [1, [Validators.required, Validators.min(1)]],
    description: [''],
  });

  protected readonly categoriesOptions: Signal<SelectOption[]> = computed(() =>
    this.categories().map((category) => ({
      value: category,
      label: EVENT_CATEGORY_LABELS[category],
    }))
  );

  private mapFormToDto(formValue: EventFormRawValue): CreateEventDto {
    const start = new Date(formValue.dateTime);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

    return {
      title: formValue.title,
      description: formValue.description,
      location: formValue.location,
      startAt: start,
      endAt: end,
      maxParticipants: Number(formValue.maxParticipants),
      category: formValue.category,
    };
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.mapFormToDto(this.form.getRawValue());

    this.http.post('/events', dto satisfies CreateEventDto).subscribe({
      next: () => {
        this.onClose.emit();
        this.formSubmitted.emit();
        this.form.reset();
      },
      error: () => {
        console.error(
          "Si è verificato un errore durante la creazione dell'evento. Per favore riprova."
        );
      },
    });
  }
}

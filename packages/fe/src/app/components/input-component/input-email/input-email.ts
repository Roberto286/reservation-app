import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-input-email',
  imports: [],
  templateUrl: './input-email.html',
  styleUrl: './input-email.css',
})
export class InputEmail {
  readonly placeholder = input('mail@site.com');
  readonly value = input('');
  readonly disabled = input(false);
  readonly label = input('');
  readonly valueChange = output<Event>();
  readonly blur = output<void>();
}

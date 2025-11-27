import { Component, input, output } from '@angular/core';

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

  protected handleInput(event: Event): void {
    this.valueChange.emit(event);
  }
}

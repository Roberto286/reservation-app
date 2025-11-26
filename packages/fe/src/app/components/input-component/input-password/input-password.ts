import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-password',
  imports: [],
  templateUrl: './input-password.html',
  styleUrl: './input-password.css',
})
export class InputPassword {
  @Input() label!: string;
  @Input() value = '';
  @Input() disabled = false;
  @Output() valueChange = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<void>();
}

import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-email',
  imports: [],
  templateUrl: './input-email.html',
  styleUrl: './input-email.css',
})
export class InputEmail {
  @Input() placeholder = 'mail@site.com';
  @Input() value = '';
  @Input() disabled = false;
  @Input() label = '';
  @Output() valueChange = new EventEmitter<Event>();
  @Output() blur = new EventEmitter<void>();
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import type {
  AuthenticationFormGroup,
  AuthenticationFormValue,
} from '../../types/authentication-form';
import { InputComponent } from '../input-component/input-component';

@Component({
  selector: 'app-authentication-form',
  imports: [ReactiveFormsModule, InputComponent, CommonModule, RouterLink],
  templateUrl: './authentication-form.html',
  styleUrl: './authentication-form.css',
})
export class AuthenticationForm {
  @Input() isSigningUp = false;
  @Output() submitForm = new EventEmitter<AuthenticationFormValue>();
  errorMessage = '';
  form: FormGroup<AuthenticationFormGroup>;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group<AuthenticationFormGroup>({
      email: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
      confirmPassword: new FormControl<string | null>(null),
    });
  }

  submit() {
    if (this.form.valid) {
      this.submitForm.emit(this.form.getRawValue());
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}

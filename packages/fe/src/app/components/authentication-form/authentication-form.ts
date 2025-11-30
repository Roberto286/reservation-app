import { CommonModule } from '@angular/common';
import { Component, effect, input, output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  type FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PASSWORD_REGEX } from '@reservation-app/shared';
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
  isSigningUp = input<boolean>(false);
  submitForm = output<AuthenticationFormValue>();
  errorMessage = '';
  form: FormGroup<AuthenticationFormGroup>;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group<AuthenticationFormGroup>({
      email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
      password: new FormControl<string | null>(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(PASSWORD_REGEX),
      ]),
      confirmPassword: new FormControl<string | null>(null),
      isAdmin: new FormControl<boolean>(false, { nonNullable: true }),
    });

    // Update confirmPassword validators when isSigningUp changes
    effect(() => {
      const confirmPasswordControl = this.form.get('confirmPassword');
      if (this.isSigningUp()) {
        confirmPasswordControl?.setValidators([Validators.required]);
      } else {
        confirmPasswordControl?.clearValidators();
      }
      confirmPasswordControl?.updateValueAndValidity();
    });
  }

  get passwordsMatch(): boolean {
    if (!this.isSigningUp()) return true;
    const password = this.form.get('password')?.value;
    const confirmPassword = this.form.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  get isFormValid(): boolean {
    return this.form.valid && this.passwordsMatch;
  }

  submit() {
    if (this.isFormValid) {
      this.submitForm.emit(this.form.getRawValue());
    } else {
      if (!this.passwordsMatch) {
        this.errorMessage = 'Le password non corrispondono.';
      } else {
        this.errorMessage = 'Please fill in all required fields.';
      }
    }
  }
}

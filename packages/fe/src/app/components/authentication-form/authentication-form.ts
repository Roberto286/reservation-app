import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
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
  isSigningUp = input<boolean>(false);
  submitForm = output<AuthenticationFormValue>();
  errorMessage = '';
  form: FormGroup<AuthenticationFormGroup>;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group<AuthenticationFormGroup>({
      email: new FormControl<string | null>(null),
      password: new FormControl<string | null>(null),
      confirmPassword: new FormControl<string | null>(null),
      userRole: new FormControl<boolean>(false, { nonNullable: true }),
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

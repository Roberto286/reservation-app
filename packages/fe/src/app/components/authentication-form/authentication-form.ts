import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, type FormControl, type FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input-component/input-component';

@Component({
  selector: 'app-authentication-form',
  imports: [ReactiveFormsModule, InputComponent, CommonModule],
  templateUrl: './authentication-form.html',
  styleUrl: './authentication-form.css',
})
export class AuthenticationForm {
  errorMessage = '';
  form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>;
  isSigningUp = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      email: '',
      password: '',
      confirmPassword: '',
    });
  }

  submit() {
    if (this.form.valid) {
      console.log('Form Submitted', this.form.value);
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }

  toggleSignUp() {
    this.isSigningUp = !this.isSigningUp;
  }
}

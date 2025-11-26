import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputComponent } from '../input-component/input-component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, InputComponent, CommonModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  errorMessage = '';
  loginForm: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  constructor(private readonly fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: '',
      password: '',
    });
  }

  submit() {
    if (this.loginForm.valid) {
      // Handle login logic here
      console.log('Form Submitted', this.loginForm.value);
    } else {
      this.errorMessage = 'Please fill in all required fields.';
    }
  }
}

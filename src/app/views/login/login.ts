import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  isActive = false;

  activeRegister() {
    this.isActive = true;
  }

  activeLogin() {
    this.isActive = false;
  }

  private formBuilder: FormBuilder = inject(FormBuilder);

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  onSubmitLogin() {
    if (this.loginForm.valid) {
      alert('Login Successful');
    } else {
      alert('Login Form is invalid');
    }
  }

  onSubmitRegister() {
    if (this.registerForm.valid) {
      alert('Registration Successful');
    } else {
      alert('Registration Form is invalid');
    }
  }
}

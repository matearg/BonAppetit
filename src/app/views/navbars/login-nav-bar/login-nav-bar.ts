import { Component, Output, EventEmitter, signal } from '@angular/core';

@Component({
  selector: 'app-login-nav-bar',
  imports: [],
  templateUrl: './login-nav-bar.html',
  styleUrl: './login-nav-bar.css',
})
export class LoginNavBar {
  protected readonly showLoginButton = signal(true);
  @Output() openLogin = new EventEmitter<void>();

  goToLogin() {
    this.showLoginButton.set(false);
    this.openLogin.emit();
  }
}

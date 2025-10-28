import { Component, signal, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly title = signal('BonAppetit');

  showLoginButton = true;
  @Output() openLogin = new EventEmitter<void>();

  goToLogin() {
    this.showLoginButton = false;
    this.openLogin.emit();
  }
}

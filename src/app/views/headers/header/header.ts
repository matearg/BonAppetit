import { Component, signal, EventEmitter, Output } from '@angular/core';
import { LoginNavBar } from '../../navbars/login-nav-bar/login-nav-bar';

@Component({
  selector: 'header',
  imports: [LoginNavBar],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  protected readonly title = signal('BonAppetit');
  @Output() openLogin = new EventEmitter<void>();

  onOpenLogin() {
    this.openLogin.emit();
  }
}

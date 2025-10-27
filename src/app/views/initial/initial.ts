import { Component, signal } from '@angular/core';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Login } from '../login/login';

@Component({
  selector: 'app-initial',
  imports: [Header, Footer, Login],
  templateUrl: './initial.html',
  styleUrl: './initial.css',
})
export class Initial {
  protected readonly showLogin = signal(false);

  openLogin() {
    this.showLogin.set(true);
  }
}

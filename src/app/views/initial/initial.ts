import { Component, inject, OnInit, signal } from '@angular/core';
import { Header } from '../headers/header/header';
import { Footer } from '../shared/footer/footer';
import { Login } from '../login/login';
import { StartPage } from './start-page/start-page';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-initial',
  imports: [Header, Footer, Login, StartPage],
  templateUrl: './initial.html',
  styleUrl: './initial.css',
})
export class Initial implements OnInit {
  protected readonly showLogin = signal(false);

  private service = inject(UserService)
  ngOnInit(): void {
    localStorage.removeItem('token')
    this.service.clearActiveUser().subscribe()
  }

  openLogin() {
    this.showLogin.set(true);
  }
}

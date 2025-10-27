import { Component, signal } from '@angular/core';
import { Initial } from './views/initial/initial';

@Component({
  selector: 'app-root',
  imports: [Initial],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('BonAppetit');
}

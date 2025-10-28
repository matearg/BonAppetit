import { Component, signal } from '@angular/core';
import { NavBar } from '../../navbars/nav-bar/nav-bar';

@Component({
  selector: 'app-home-page-header',
  imports: [NavBar],
  templateUrl: './home-page-header.html',
  styleUrl: './home-page-header.css',
})
export class HomePageHeader {
  protected readonly title = signal('BonAppetit');
}

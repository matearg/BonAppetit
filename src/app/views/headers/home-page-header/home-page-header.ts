import { Component, signal } from '@angular/core';
import { NavBar } from '../../navbars/nav-bar/nav-bar';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page-header',
  imports: [NavBar, RouterLink],
  templateUrl: './home-page-header.html',
  styleUrl: './home-page-header.css',
})
export class HomePageHeader {
  protected readonly title = signal('BonAppetit');
}

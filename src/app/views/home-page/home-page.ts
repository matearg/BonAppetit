import { Component } from '@angular/core';
import { HomePageMenu } from './home-page-menu/home-page-menu';
import { Footer } from '../shared/footer/footer';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';

@Component({
  selector: 'app-home-page',
  imports: [HomePageMenu, HomePageHeader, Footer],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage {}

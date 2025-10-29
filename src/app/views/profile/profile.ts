import { Component, signal } from '@angular/core';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Footer } from '../shared/footer/footer';

@Component({
  selector: 'app-profile',
  imports: [HomePageHeader, Footer],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {}

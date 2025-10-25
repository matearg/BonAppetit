import { Component } from '@angular/core';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-initial',
  imports: [Header, Footer],
  templateUrl: './initial.html',
  styleUrl: './initial.css',
})
export class Initial {

}

import { Component, inject, OnInit } from '@angular/core';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Footer } from '../shared/footer/footer';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-profile',
  imports: [HomePageHeader, Footer, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private service = inject(UserService);
  profileImage = 'img/user-profile.webp'

  activeUser: ActiveUser = {
    id: 0,
    email: ''
  }

  commonUser: User = {
    email: '',
    password: '',
    recipeList: []
  }

  ngOnInit(): void {
    this.service.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        this.service.getUserById(this.activeUser.id).subscribe({
          next: (user) => {
            this.commonUser = user;
          },
          error: (error: Error) => {
            console.log(error.message);
          }
        })
      },
      error: (error: Error) => {
        console.log(error.message);
      }
    })
  }
}

import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageMenu } from './home-page-menu/home-page-menu';
import { Footer } from '../shared/footer/footer';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { Recipe } from '../../interfaces/random-recipe';
import { RecipeCard } from '../../recipes/recipe-card/recipe-card';

@Component({
  selector: 'app-home-page',
  imports: [HomePageMenu, HomePageHeader, Footer, RecipeCard],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit, OnDestroy {
  private sub?: Subscription;
  private ruotes = inject(Router);
  private service = inject(RecipeService);
  private userService = inject(UserService);

  user: ActiveUser = {
    id: 0,
    email: "invited@invited.com"
  }

  recipeList: Array<Recipe> = []

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.userService.auth().subscribe({
      next: (activeUser) => {
        if (activeUser) {
          this.user = activeUser
          this.getRandomRecipes()
        }
      }
    });
  }

  getRandomRecipes() {
    this.service.getRandomRecipe(5).subscribe({
      next: (data) => {
        console.log(data);
        this.recipeList = data.recipes;
      },
      error: (error: Error) => {
        console.log(error.message);
      }
    });
  }

  navigateToDetails(id: number | string | undefined) {
    this.ruotes.navigate([`recipes-details/${id}`])
  }
}

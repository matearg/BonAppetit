import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageMenu } from './home-page-menu/home-page-menu';
import { Footer } from '../shared/footer/footer';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Subscription, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { Recipe } from '../../interfaces/recipe'; // Usamos la nueva interfaz
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HomePageMenu, HomePageHeader, Footer, CommonModule], // Quitamos RecipeCard
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit, OnDestroy {
  private sub?: Subscription;
  private router = inject(Router);
  private service = inject(RecipeService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  user: ActiveUser = {
    id: 0,
    email: 'invited@invited.com',
  };

  recipeList: Array<Recipe> = [];
  private refreshSub?: Subscription;

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.refreshSub?.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.userService
      .auth()
      .pipe(
        tap((activeUser) => {
          if (activeUser) {
            this.user = activeUser;
          }
        }),
        switchMap(() => {
          // En lugar del viejo Spoonacular, hacemos una búsqueda genérica a nuestra IA/YouTube
          const prompt = 'recetas de comida fáciles, rápidas y muy deliciosas';
          return this.service.getYouTubeRecipes(prompt);
        }),
      )
      .subscribe({
        next: (data: any[]) => {
          // Mapeamos los videos de YouTube al formato Recipe
          this.recipeList = data.map((v) => ({
            id: v.videoId,
            title: v.title,
            image: v.thumbnailUrl,
            anotations: '',
          }));
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          console.log('Error en la carga:', error.message);
        },
      });
  }

  getRandomRecipes() {
    this.refreshSub?.unsubscribe();

    // Array de búsquedas aleatorias para que el botón "More recipes" muestre cosas distintas
    const randomPrompts = [
      'recetas vegetarianas increíbles',
      'comida mexicana casera',
      'pastas italianas fáciles',
      'postres sin horno',
    ];
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];

    this.refreshSub = this.service.getYouTubeRecipes(randomPrompt).subscribe({
      next: (data: any[]) => {
        this.recipeList = data.map((v) => ({
          id: v.videoId,
          title: v.title,
          image: v.thumbnailUrl,
          anotations: '',
        }));
        this.cdr.markForCheck();
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
  }

  navigateToDetails(recipe: Recipe) {
    // Navegamos pasando la info en el state, igual que en recipe-list
    this.router.navigate([`recipes-details/${recipe.id}`], {
      state: { videoData: { videoId: recipe.id, title: recipe.title, thumbnailUrl: recipe.image } },
    });
  }
}

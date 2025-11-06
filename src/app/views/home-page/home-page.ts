import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageMenu } from './home-page-menu/home-page-menu';
import { Footer } from '../shared/footer/footer';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Subscription, switchMap, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { Recipe } from '../../interfaces/random-recipe';
import { RecipeCard } from '../../recipes/recipe-card/recipe-card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home-page',
  imports: [HomePageMenu, HomePageHeader, Footer, RecipeCard, CommonModule],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit, OnDestroy {
  private sub?: Subscription;
  private ruotes = inject(Router);
  private service = inject(RecipeService);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);

  user: ActiveUser = {
    id: 0,
    email: 'invited@invited.com',
  };

  recipeList: Array<Recipe> = [];

  // 1. AÑADE UNA NUEVA PROPIEDAD PARA EL BOTÓN
  private refreshSub?: Subscription;

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.refreshSub?.unsubscribe(); // 2. LIMPIA AMBAS SUSCRIPCIONES
  }

  ngOnInit(): void {
    // 3. ESTE ES EL NUEVO 'ngOnInit'
    this.sub = this.userService
      .auth()
      .pipe(
        // Primero, manejamos al usuario
        tap((activeUser) => {
          if (activeUser) {
            this.user = activeUser;
          }
        }),
        // Segundo, SIEMPRE cambiamos a las recetas
        switchMap(() => {
          return this.service.getRandomRecipe(6);
        }),
        // Tercero, manejamos los datos de las recetas
        tap((data) => {
          console.log(data);
          this.recipeList = data.recipes;
          this.cdr.markForCheck(); // Actualizamos la vista
        })
      )
      .subscribe({
        next: () => {
          console.log('Usuario y recetas cargados, vista actualizada.');
        },
        error: (error: Error) => {
          console.log('Error en la cadena de carga:', error.message);
        },
      });
  }

  // 4. ARREGLA 'getRandomRecipes' PARA NO TENER FUGAS
  getRandomRecipes() {
    // Cancela cualquier petición anterior del botón
    this.refreshSub?.unsubscribe();

    // Crea una nueva suscripción solo para el botón
    this.refreshSub = this.service.getRandomRecipe(6).subscribe({
      next: (data) => {
        console.log(data);
        this.recipeList = data.recipes;

        this.cdr.markForCheck();
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
  }

  navigateToDetails(id: number) {
    this.ruotes.navigate([`recipes-details/${id}`]);
  }
}

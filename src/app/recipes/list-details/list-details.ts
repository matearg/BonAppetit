import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomRecipeLists, Recipe, RecipeInfo } from '../../interfaces/recipe';
import { CustomRecipeListService } from '../../services/custom-recipe-list';
import { UserService } from '../../services/user-service';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { DeleteUpdateOutput } from '../delete-update-output/delete-update-output';
import { Footer } from '../../views/shared/footer/footer';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-list-details',
  imports: [HomePageHeader, Footer, DeleteUpdateOutput],
  templateUrl: './list-details.html',
  styleUrl: './list-details.css',
})
export class ListDetails implements OnInit, OnDestroy {
  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  routes = inject(Router);
  list?: CustomRecipeLists;
  activeRoute = inject(ActivatedRoute);
  customRecipeListServce = inject(CustomRecipeListService);
  userService = inject(UserService);
  changeDetectorRef = inject(ChangeDetectorRef);

  recipesArray: Array<RecipeInfo> = [];

  showRecipe: Recipe = {
    vegan: false,
    vegetarian: false,
    glutenFree: false,
    title: '',
    readyInMinutes: 0,
    servings: 0,
    instructions: '',
    spoonacularScore: 0,
    image: '',
    anotations: '',
    ingredients: [],
  };

  private sub = new Subscription();

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadArray() {
    // Limpiamos el array por si acaso
    this.recipesArray = [];
    this.list?.recipes.forEach((recipe) => {
      this.recipesArray.push(recipe as unknown as RecipeInfo);
    });
  }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');

    if (id) {
      this.sub.add(
        this.userService
          .getActiveUser()
          .pipe(
            // Usa switchMap para aplanar
            switchMap((foundUser) => {
              this.activeUser = foundUser[0];
              return this.userService.getUserById(this.activeUser.id);
            }),
            // Usa tap para asignar datos y avisar a Angular
            tap((user) => {
              this.commonUser = user;
              this.list = this.commonUser.recipeLists.find((list: any) => list.id == Number(id));
              this.loadArray();

              this.changeDetectorRef.markForCheck();
            })
          )
          .subscribe({
            next: () => console.log('Detalles de la lista cargados'),
            error: (error: Error) => console.log(error.message),
          })
      );
    }
  }

  navigateToDetails(event: { listId: number; recipeId: number }) {
    const { listId, recipeId } = event;
    this.routes.navigate([`/recipe-list-details/${listId}/${recipeId}`]);
  }

  deleteRecipe(recipeId: number) {
    if (this.list?.recipes) {
      // Encuentra el índice en la lista original
      const index = this.list.recipes.findIndex((recipe) => recipe.id === recipeId);

      if (index !== -1) {
        this.list.recipes.splice(index, 1);

        this.sub.add(
          this.userService.editUser(this.commonUser).subscribe({
            next: () => {
              const arrayIndex = this.recipesArray.findIndex((recipe) => recipe.id === recipeId);
              if (arrayIndex !== -1) {
                this.recipesArray.splice(arrayIndex, 1);
              }

              // Avisa a Angular que la vista cambió
              this.changeDetectorRef.markForCheck();
            },
            error: (error: Error) => {
              console.error('Error deleting recipe:', error.message);
            },
          })
        );
      } else {
        console.error('Recipe not found in the list.');
      }
    } else {
      console.error('No recipes found in the list.');
    }
  }

  onUpdate(event: { listId: number; recipeId: number }) {
    const { listId, recipeId } = event;
    if (this.list?.recipes) {
      const recipe = this.list.recipes.find((recipe) => recipe.id === recipeId);
      if (recipe) {
        this.routes.navigate([`/update-recipe/${listId}/${recipeId}`]);
      } else {
        console.error('Recipe not found in the list.');
      }
    } else {
      console.error('No recipes found in the list.');
    }
  }
}

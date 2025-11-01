import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomRecipeLists, Recipe, RecipeInfo } from '../../interfaces/recipe';
import { CustomRecipeListService } from '../../services/custom-recipe-list';
import { UserService } from '../../services/user-service';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { DeleteUpdateOutput } from '../delete-update-output/delete-update-output';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-list-details',
  imports: [HomePageHeader, Footer, DeleteUpdateOutput],
  templateUrl: './list-details.html',
  styleUrl: './list-details.css',
})
export class ListDetails implements OnInit {
  actvieUser: ActiveUser = {
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

  loadArray() {
    this.list?.recipes.forEach((recipe) => {
      this.recipesArray.push(recipe as unknown as RecipeInfo);
    });
  }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');

    if (id) {
      this.userService.getActiveUser().subscribe({
        next: (foundUser) => {
          this.actvieUser = foundUser[0];
          this.userService.getUserById(this.actvieUser.id).subscribe({
            next: (user) => {
              this.commonUser = user;
              this.list = this.commonUser.recipeLists.find((list: any) => list.id == Number(id));
              this.loadArray();
            },
            error: (error: Error) => {
              console.log(error.message);
            },
          });
        },
        error: (error: Error) => {
          console.log(error.message);
        },
      });
    }
  }

  navigateToDetails(event: {
    listId: number | string | undefined;
    recipeId: number | string | undefined;
  }) {
    const { listId, recipeId } = event;
    this.routes.navigate([`/my-recipe-details/${listId}/${recipeId}`]);
  }

  deleteRecipe(recipeId: number | string | undefined) {
    if (this.list?.recipes) {
      const index = this.list.recipes.findIndex((recipe) => recipe.id === recipeId);
      if (index !== -1) {
        this.list.recipes.splice(index, 1);
        this.userService.editUser(this.commonUser).subscribe({
          next: () => {
            window.location.reload();
            this.routes.navigate([`/list/${this.list?.id}`]);
          },
          error: (error: Error) => {
            console.error('Error deleting recipe:', error.message);
          },
        });
      } else {
        console.error('Recipe not found in the list.');
      }
    } else {
      console.error('No recipes found in the list.');
    }
  }

  onUpdate(event: { listId: number | string | undefined; recipeId: number | string | undefined }) {
    const { listId, recipeId } = event;
    if (this.list?.recipes) {
      const recipe = this.list.recipes.find((recipe) => recipe.id === recipeId);
      if (recipe) {
        this.routes.navigate([`/update-my-recipe/${listId}/${recipeId}`]);
      } else {
        console.error('Recipe not found in the list.');
      }
    } else {
      console.error('No recipes found in the list.');
    }
  }
}

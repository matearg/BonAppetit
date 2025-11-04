import { Component, inject, OnInit } from '@angular/core';
import { ExtendedIngredient, Ingredients, Recipe, RecipeInfo } from '../../interfaces/recipe';
import { UserService } from '../../services/user-service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-recipe-detail',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit {
  recipe!: RecipeInfo;
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  listAddActive: boolean = false;
  router = inject(Router);

  constructor(private activatedRoute: ActivatedRoute, private recipeService: RecipeService) {}

  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  form = this.formBuilder.nonNullable.group({
    listId: [0, Validators.required],
  });

  ngOnInit() {
    this.obtainUser();
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.recipeService.getRecipeInfotmation(id).subscribe({
      next: (data) => (this.recipe = data),
      error: (error: Error) => console.log('Error loading recipe details', error.message),
    });
  }

  getInstructions() {
    if (!this.recipe?.instructions) return [];
    const cleanText = this.recipe.instructions.replace(/<\/?[^>]+(>|$)/g, '');
    return cleanText.split('\n').filter((step) => step.trim() !== '');
  }

  obtainUser() {
    this.userService.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        this.userService.getUserById(this.activeUser.id).subscribe({
          next: (user) => {
            this.commonUser = user;
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

  addRecipe() {
    const recipe = this.mapRecipeInfo(this.recipe);
    const listId = this.form.get('listId')?.value;
    console.log('Selected List ID:', listId);

    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));
    console.log(selectedList);

    if (selectedList) {
      selectedList.recipes.push(recipe);
      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          this.alertRecetaAdd();
          this.router.navigate(['/home']);
        },
        error: (error: Error) => {
          console.log('Error saving recipe:', error.message);
        },
      });
    } else {
      console.error('Selected list not found');
    }
  }

  mapRecipeInfo(recipeInfo: RecipeInfo): Recipe {
    return {
      vegetarian: recipeInfo.vegetarian,
      vegan: recipeInfo.vegan,
      glutenFree: recipeInfo.glutenFree,
      title: recipeInfo.title,
      readyInMinutes: recipeInfo.readyInMinutes,
      servings: recipeInfo.servings,
      image: recipeInfo.image,
      instructions: recipeInfo.instructions,
      spoonacularScore: recipeInfo.spoonacularScore,
      id: recipeInfo.id,
      ingredients: recipeInfo.extendedIngredients.map(this.mapExtendedIngredients),
    };
  }

  mapExtendedIngredients(extendedIngredients: ExtendedIngredient): Ingredients {
    return {
      name: extendedIngredients.name,
      unit: extendedIngredients.unit,
      amount: extendedIngredients.amount,
    };
  }

  alertRecetaAdd() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1400,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Receta agregada a la lista',
    });
  }
}

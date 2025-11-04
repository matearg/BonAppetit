import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Ingredients, Recipe } from '../../interfaces/recipe';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-recipe-form',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm implements OnInit {
  recipeService = inject(RecipeService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  recipes: Array<Recipe> = [];

  listId = 0;

  form = this.formBuilder.nonNullable.group({
    id: [0],
    title: ['', Validators.required],
    vegetarian: [false, Validators.required], // Tipo boolean
    vegan: [false, Validators.required], // Tipo boolean
    glutenFree: [false, Validators.required], // Tipo boolean
    readyInMinutes: [0, [Validators.required, Validators.min(1)]], // Tipo number
    servings: [1, [Validators.required, Validators.min(1)]], // Tipo number
    instructions: ['', Validators.required],
    image: [''],
    spoonacularScore: [0],
    listId: [0, Validators.required],
    ingredients: this.formBuilder.array([]),
  });

  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  ngOnInit(): void {
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
    if (this.form.invalid) return;

    const recipe = {
      ...this.form.getRawValue(),
      ingredients: this.form.get('ingredients')?.value as Ingredients[],
    } as Recipe;
    const listId = this.form.get('listaId')?.value;
    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));

    if (!recipe.image || recipe.image.trim() === '') {
      recipe.image = 'img/logoUltimo.jpeg';
    }

    if (selectedList) {
      recipe.id = selectedList.recipes.length;

      selectedList.recipes.push(recipe);

      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          this.alertCreatedRecipe();
          this.router.navigate(['mis-listas']);
        },
        error: (error: Error) => {
          console.error('Error saving recipe:', error.message);
        },
      });
    } else {
      this.alertListNotFound();
    }
  }

  alertCreatedRecipe() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Receta agregada con exito',
    });
  }

  alertListNotFound() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title: 'Lista no encontrada',
    });
  }

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.1)]],
      unit: ['', Validators.required],
    });
    this.ingredients.push(ingredientForm);
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }
}

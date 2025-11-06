import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-form',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm implements OnInit, OnDestroy {
  recipeService = inject(RecipeService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  recipes: Array<Recipe> = [];
  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub.add(
      // Añade al gestor
      this.userService
        .getActiveUser()
        .pipe(
          // Usa switchMap para aplanar
          switchMap((user) => {
            this.activeUser = user[0];
            return this.userService.getUserById(this.activeUser.id);
          }),
          // Usa tap para asignar y avisar
          tap((user) => {
            this.commonUser = user;
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: () => console.log('Usuario cargado para el formulario'),
          error: (error: Error) => console.log(error.message),
        })
    );
  }

  addRecipe() {
    if (this.form.invalid) return;

    const recipe = {
      ...this.form.getRawValue(),
      ingredients: this.form.get('ingredients')?.value as Ingredients[],
    } as Recipe;

    const listId = this.form.get('listId')?.value;
    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));

    if (!recipe.image || recipe.image.trim() === '') {
      recipe.image = 'img/logo.jpeg';
    }

    if (selectedList) {
      // (Pequeña mejora de ID para evitar duplicados si se borra algo)
      recipe.id = Math.max(0, ...selectedList.recipes.map((r) => r.id || 0)) + 1;

      selectedList.recipes.push(recipe);

      this.sub.add(
        this.userService.editUser(this.commonUser).subscribe({
          next: () => {
            this.alertCreatedRecipe();
            this.router.navigate(['/my-lists']);
          },
          error: (error: Error) => {
            console.error('Error saving recipe:', error.message);
          },
        })
      );
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

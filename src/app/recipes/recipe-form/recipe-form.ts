import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

  isEditMode = false;
  private listId: number | null = null;
  private recipeId: number | null = null;
  private recipe?: Recipe;

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
    const listIdParam = this.activeRoute.snapshot.paramMap.get('idList');
    const recipeIdParam = this.activeRoute.snapshot.paramMap.get('idRecipe');

    if (listIdParam && recipeIdParam) {
      this.isEditMode = true;
      this.listId = Number(listIdParam);
      this.recipeId = Number(recipeIdParam);
    }

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
            if (this.isEditMode) {
              this.getRecipeUpdate();
            }
            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: () => console.log('Usuario cargado para el formulario'),
          error: (error: Error) => console.log(error.message),
        })
    );
  }

  getRecipeUpdate() {
    console.log('User lists:', this.commonUser.recipeLists);
    const selectedList = this.commonUser.recipeLists.find((list) => list.id == this.listId);
    console.log('Selected list:', selectedList);

    if (selectedList) {
      const selectedRecipe = selectedList.recipes.find((recipe) => recipe.id == this.recipeId);
      console.log('Selected recipe:', selectedRecipe);

      if (selectedRecipe) {
        this.recipe = selectedRecipe;
        this.form.patchValue({
          title: this.recipe.title,
          vegetarian: this.recipe.vegetarian,
          vegan: this.recipe.vegan,
          glutenFree: this.recipe.glutenFree,
          readyInMinutes: this.recipe.readyInMinutes,
          servings: this.recipe.servings,
          instructions: this.recipe.instructions,
          image: this.recipe.image,
          spoonacularScore: this.recipe.spoonacularScore,
          listId: this.listId ?? 0,
        });

        const ingredientsFormArray = this.form.get('ingredients') as FormArray;
        ingredientsFormArray.clear();
        this.recipe.ingredients.forEach((ingredient) => {
          ingredientsFormArray.push(this.createIngredientFormGroup(ingredient));
        });
      } else {
        console.log('Recipe not found');
        this.isEditMode = false;
      }
    } else {
      console.log('List not found');
      this.isEditMode = false;
    }
  }

  createIngredientFormGroup(ingredient: Ingredients): FormGroup {
    return this.formBuilder.group({
      name: [ingredient.name || '', Validators.required],
      amount: [ingredient.amount || '', Validators.required],
      unit: [ingredient.unit || '', Validators.required],
    });
  }

  saveRecipe() {
    if (this.form.invalid) return;
    if (this.isEditMode) {
      this.updateRecipe();
    } else {
      this.addRecipe();
    }
  }

  private addRecipe() {
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

  updateRecipe() {
    if (this.form.invalid || this.recipeId === null || this.listId === null) return;

    const recipeFormValue = this.form.getRawValue();
    const updatedRecipe: Recipe = {
      ...recipeFormValue,
      id: this.recipeId,
      ingredients: recipeFormValue.ingredients.map((ingredient: any) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
    };

    const selectedList = this.commonUser.recipeLists.find((list) => list.id == this.listId);
    if (selectedList) {
      const recipeIndex = selectedList.recipes.findIndex((recipe) => recipe.id == this.recipeId);
      if (recipeIndex !== -1) {
        selectedList.recipes[recipeIndex] = updatedRecipe; // Reemplazamos la receta

        this.sub.add(
          this.userService.editUser(this.commonUser).subscribe({
            next: () => {
              this.alertModifiedRecipe();
              this.router.navigate(['my-lists']);
            },
            error: (error: Error) => {
              console.error('Error updating recipe:', error.message);
            },
          })
        );
      } else {
        console.error('Recipe not found');
      }
    } else {
      console.error('List not found');
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

  alertModifiedRecipe() {
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
      title: 'Receta modificada con exito',
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

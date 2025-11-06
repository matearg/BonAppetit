import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomRecipeLists, Ingredients, Recipe } from '../../interfaces/recipe';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { CommonModule } from '@angular/common';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-recipe-update',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './recipe-update.html',
  styleUrl: './recipe-update.css',
})
export class RecipeUpdate implements OnInit, OnDestroy {
  recipeService = inject(RecipeService);
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  lists: CustomRecipeLists[] = [];

  recipe?: Recipe;

  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  id: number | null = null;
  listId!: number;

  form = this.formBuilder.nonNullable.group({
    title: ['', Validators.required],
    vegetarian: [false, Validators.required],
    vegan: [false, Validators.required],
    glutenFree: [false, Validators.required],
    readyInMinutes: [0, [Validators.required, Validators.min(1)]],
    servings: [1, [Validators.required, Validators.min(1)]],
    instructions: ['', Validators.required],
    image: [''],
    spoonacularScore: [0],
    listId: [0, Validators.required],
    ingredients: this.formBuilder.array([]),
  });

  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub.add(
      this.userService
        .getActiveUser()
        .pipe(
          // Obtener usuario activo
          switchMap((userArray) => {
            this.activeUser = userArray[0];
            // Obtener usuario completo (con listas)
            return this.userService.getUserById(this.activeUser.id);
          }),
          tap((user) => {
            // Asignar datos
            this.commonUser = user;
            this.lists = this.commonUser.recipeLists;
            this.cdr.markForCheck();
          }),
          // Obtener parámetros de la ruta
          switchMap(() => {
            this.listId = Number(this.activeRoute.snapshot.paramMap.get('idList'));
            return this.activeRoute.paramMap;
          }),
          // Asignar ID de receta y cargar el formulario
          tap((param) => {
            const idString = param.get('idRecipe');
            this.id = idString !== null ? Number(idString) : null;

            if (this.id !== null) {
              this.getRecipeUpdate();
              this.cdr.markForCheck();
            } else {
              console.log('The id value is not a valid number');
            }
          })
        )
        .subscribe({
          next: () => console.log('Formulario de actualización cargado'),
          error: (error: Error) => console.log(error.message),
        })
    );
  }

  createIngredientFormGroup(ingredient: Ingredients): FormGroup {
    return this.formBuilder.group({
      name: [ingredient.name || '', Validators.required],
      amount: [ingredient.amount || '', Validators.required],
      unit: [ingredient.unit || '', Validators.required],
    });
  }

  getRecipeUpdate() {
    console.log('User lists:', this.commonUser.recipeLists);
    const selectedList = this.commonUser.recipeLists.find((list) => list.id == this.listId);
    console.log('Selected list:', selectedList);

    if (selectedList) {
      const selectedRecipe = selectedList.recipes.find((recipe) => recipe.id == this.id);
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
          listId: this.listId,
        });

        const ingredientsFormArray = this.form.get('ingredients') as FormArray;
        ingredientsFormArray.clear();
        this.recipe.ingredients.forEach((ingredient) => {
          ingredientsFormArray.push(this.createIngredientFormGroup(ingredient));
        });
      } else {
        console.log('Recipe not found');
      }
    } else {
      console.log('List not found');
    }
  }

  updateRecipe() {
    if (this.form.invalid || this.id === null) return;

    const recipeFormValue = this.form.getRawValue();
    const recipe: Recipe = {
      ...recipeFormValue,
      ingredients: recipeFormValue.ingredients.map((ingredient: any) => ({
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      })),
    };

    const selectedList = this.commonUser.recipeLists.find((list) => list.id == this.listId);
    if (selectedList) {
      const recipeIndex = selectedList.recipes.findIndex((recipe) => recipe.id == this.id);
      if (recipeIndex !== -1) {
        const originalId = selectedList.recipes[recipeIndex].id;
        selectedList.recipes[recipeIndex] = { ...recipe, id: originalId }; // Combina la data del form pero mantiene el ID

        this.sub.add(
          this.userService.editUser(this.commonUser).subscribe({
            next: () => {
              this.modifiedAlert();
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

  get ingredients() {
    return this.form.get('ingredients') as FormArray;
  }

  addIngredient() {
    const ingredientForm = this.formBuilder.group({
      name: ['', Validators.required],
      amount: [0, Validators.required],
      unit: ['', Validators.required],
    });

    this.ingredients.push(ingredientForm);
  }

  deleteIngredient(index: number) {
    this.ingredients.removeAt(index);
  }

  modifiedAlert() {
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
}

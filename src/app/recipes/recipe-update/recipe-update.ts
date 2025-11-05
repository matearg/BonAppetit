import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-recipe-update',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-update.html',
  styleUrl: './recipe-update.css',
})
export class RecipeUpdate implements OnInit {
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

  ngOnInit(): void {
    this.userService.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        console.log('Active user:', user);
        this.userService.getUserById(this.activeUser.id).subscribe({
          next: (user) => {
            console.log('User with lists:', user);
            this.commonUser = user;
            this.lists = this.commonUser.recipeLists;
            console.log('User lists:', this.lists);
            this.listId = Number(this.activeRoute.snapshot.paramMap.get('listId'));
            console.log('lista:', this.listId);
            this.activeRoute.paramMap.subscribe({
              next: (param) => {
                const idString = param.get('id'); // Obtener el valor como string o null
                this.id = idString !== null ? Number(idString) : null; // Convertir a número si no es null
                if (this.id === null || isNaN(this.id)) {
                  console.log('The id value is not a valid number');
                  this.id = null; // Opcional: asignar null si no es un número válido
                } else {
                  console.log('Numeric ID:', this.id);
                  // this.getRecipeUpdate();
                }
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
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
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
    const selectedList = this.commonUser.recipeLists.find(list => list.id === this.listId);
    console.log('Selected list:', selectedList);


    if (selectedList) {
      const selectedRecipe = selectedList.recipes.find(recipe => recipe.id === this.id);
      console.log('Selected recipe:', selectedRecipe);

      if (selectedRecipe) {
        this.recipe = selectedRecipe;
        this.form.controls['title'].setValue(this.recipe.title);
        this.form.controls['vegetarian'].setValue(this.recipe.vegetarian);
        this.form.controls['vegan'].setValue(this.recipe.vegan);
        this.form.controls['glutenFree'].setValue(this.recipe.glutenFree);
        this.form.controls['readyInMinutes'].setValue(this.recipe.readyInMinutes);
        this.form.controls['servings'].setValue(this.recipe.servings);
        this.form.controls['instructions'].setValue(this.recipe.instructions);
        this.form.controls['image'].setValue(this.recipe.image);
        this.form.controls['spoonacularScore'].setValue(this.recipe.spoonacularScore);
        this.form.controls['listId'].setValue(this.listId);

        const ingredientsFormArray = this.form.get('ingredients') as FormArray;
        ingredientsFormArray.clear();
        this.recipe.ingredients.forEach(ingredient => {
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
        id: ingredient.id,
        name: ingredient.name,
        amount: ingredient.amount,
        unit: ingredient.unit,
      }))
    };

    const selectedList = this.commonUser.recipeLists.find((list) => list.id === this.listId);
    if (selectedList) {
      const recipeIndex = selectedList.recipes.findIndex(recipe => recipe.id === this.id);
      if (recipeIndex !== -1) {
        selectedList.recipes[recipeIndex] = { ...selectedList.recipes[recipeIndex], ...recipe };

        this.userService.editUser(this.commonUser).subscribe({
          next: () => {
            this.modifiedAlert();
            this.router.navigate(['my-lists']);
          },
          error: (error: Error) => {
            console.error('Error updating recipe:', error.message);
          }
        });
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
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Receta modificada con exito"
    });
  }
}

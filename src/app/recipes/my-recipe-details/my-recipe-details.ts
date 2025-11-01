import { Component, inject, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/recipe';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-my-recipe-details',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './my-recipe-details.html',
  styleUrl: './my-recipe-details.css',
})
export class MyRecipeDetails implements OnInit {
  recipe: Recipe = {
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    id: 0,
    title: 'Recipe Not Found',
    readyInMinutes: 0,
    servings: 0,
    image: '',
    instructions: '',
    spoonacularScore: 0,
    anotations: '',
    ingredients: [],
  };

  routes = inject(ActivatedRoute);
  listId!: number;
  recipeId!: number;
  userService = inject(UserService);

  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  constructor() {}

  ngOnInit(): void {
    this.listId = Number(this.routes.snapshot.paramMap.get('listId'));
    this.recipeId = Number(this.routes.snapshot.paramMap.get('recipeId'));
    this.searchUser();
  }

  searchUser() {
    this.userService.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        this.userService.getUserById(this.activeUser.id).subscribe({
          next: (commonUser) => {
            this.commonUser = commonUser;
            this.showRecipe();
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

  formBuilder = inject(FormBuilder);
  form = this.formBuilder.group({
    anotations: ['', Validators.required],
  });

  showRecipe() {
    const list = this.commonUser.recipeLists.find((list) => list.id === this.listId);

    if (list) {
      this.recipe = list.recipes.find((recipe) => recipe.id === this.recipeId) || {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        id: 0,
        title: 'Recipe Not Found',
        readyInMinutes: 0,
        servings: 0,
        image: '',
        instructions: '',
        spoonacularScore: 0,
        ingredients: [],
      };
      this.form.patchValue({
        anotations: this.recipe.anotations,
      });
    } else {
      console.error('List not found');
    }
  }

  getInstructions(): string[] {
    if (!this.recipe?.instructions || this.recipe.instructions.trim() === '') {
      console.warn('No instructions available for this recipe.');
      return [];
    }
    const cleanText = this.recipe.instructions.replace(/<\/?[^>]+(>|$)/g, '').trim();
    const steps = cleanText
      .split('\n')
      .map((step) => step.trim())
      .filter((step) => step !== '');

    console.log('Extracted steps:', steps);
    return steps;
  }

  saveAnotations() {
    if (this.form.invalid) return;
    const anotation = this.form.get('anotations')?.value;

    this.recipe.anotations = anotation;

    this.userService.editUser(this.commonUser).subscribe({
      next: () => {
        this.alertAnotationSaved();
      },
      error: (error: Error) => {
        console.log('Error saving anotations: ', error.message);
      },
    });
  }

  alertAnotationSaved() {
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
      title: 'Anotations saved successfully',
    });
  }
}

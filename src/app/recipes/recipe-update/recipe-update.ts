import { Component, inject, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { UserService } from '../../services/user-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomRecipeLists, Ingredients, Recipe } from '../../interfaces/recipe';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-recipe-update',
  imports: [],
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

  formulario = this.formBuilder.nonNullable.group({
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
}

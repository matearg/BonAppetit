import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
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
import {
  catchError,
  forkJoin,
  Observable,
  of,
  Subscription,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  private mainSub = new Subscription();
  recipe!: Recipe;
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  listAddActive: boolean = false;
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  isMyRecipe = false;
  recipeSteps: string[] = [];
  isInstructionsHtml = false;

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

  formAddToList = this.formBuilder.nonNullable.group({
    listId: [0, Validators.required],
  });

  formAnotations = this.formBuilder.group({
    anotations: ['', Validators.required],
  });

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const listIdParam = this.activatedRoute.snapshot.paramMap.get('idList');
    const recipeIdParam = this.activatedRoute.snapshot.paramMap.get('idRecipe');

    if (listIdParam && recipeIdParam) {
      // --- MODO 1: Cargar receta del USUARIO ---
      this.isMyRecipe = true;
      const listId = Number(listIdParam);
      const recipeId = Number(recipeIdParam);

      this.mainSub.add(
        this.obtainUser()
          .pipe(
            tap((user) => {
              this.commonUser = user;
              this.loadUserRecipe(listId, recipeId);
              this.cdr.markForCheck();
            })
          )
          .subscribe({
            error: (error: Error) => console.log('Error loading user recipe', error.message),
          })
      );
    } else if (id) {
      // --- MODO 2: Cargar receta de la API ---
      this.isMyRecipe = false;
      const recipe$ = this.recipeService.getRecipeInfotmation(Number(id));
      const user$ = this.obtainUser();

      this.mainSub.add(
        forkJoin({
          recipeData: recipe$,
          userData: user$,
        }).subscribe({
          next: (results) => {
            // Convertimos la RecipeInfo de la API a nuestra 'Recipe' interna
            this.recipe = this.mapRecipeInfo(results.recipeData);
            this.commonUser = results.userData;
            this.processInstructions(); // Procesamos instrucciones
            this.cdr.markForCheck();
          },
          error: (error: Error) => console.log('Error loading API recipe data', error.message),
        })
      );
    }
  }

  private loadUserRecipe(listId: number, recipeId: number) {
    const list = this.commonUser.recipeLists.find((list) => list.id == listId);
    if (list) {
      const foundRecipe = list.recipes.find((recipe) => recipe.id == recipeId);
      if (foundRecipe) {
        this.recipe = foundRecipe;
        this.formAnotations.patchValue({
          anotations: this.recipe.anotations,
        });
        this.processInstructions(); // Procesamos instrucciones
      } else {
        console.error('Recipe not found');
      }
    } else {
      console.error('List not found');
    }
  }

  ngOnDestroy(): void {
    this.mainSub.unsubscribe();
  }

  private processInstructions() {
    if (!this.recipe?.instructions || this.recipe.instructions.trim() === '') {
      this.recipeSteps = [];
      this.isInstructionsHtml = false;
      return;
    }

    const instructions = this.recipe.instructions.trim();

    // Si las instrucciones empiezan con "<", asumimos que es HTML
    if (instructions.startsWith('<')) {
      this.isInstructionsHtml = true;
    } else {
      // Si no, es texto plano y lo dividimos por saltos de línea
      this.isInstructionsHtml = false;
      this.recipeSteps = instructions
        .split('\n')
        .map((step) => step.trim())
        .filter((step) => step !== '');
    }
  }

  obtainUser(): Observable<User> {
    return this.userService.getActiveUser().pipe(
      switchMap((userArray) => {
        const activeUser = userArray[0]; // Comprueba el usuario antes de asignarlo

        if (!activeUser) {
          // Hay token pero no hay sesión en la BD.
          console.error(
            'Inconsistent authentication state: The token exists but ActiveUser is not in the database.'
          );
          this.router.navigate(['']);
          return throwError(() => new Error('No active user session was found.'));
        }

        // Si llegamos aca, el usuario es válido
        this.activeUser = activeUser;
        return this.userService.getUserById(this.activeUser.id);
      }),
      catchError((err) => {
        console.error('Error in obtainUser:', err.message);
        this.router.navigate(['']);
        return of(null as any);
      })
    );
  }

  // Lógica de "addRecipe" (Modo API)
  addRecipe() {
    const listId = this.formAddToList.get('listId')?.value;
    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));

    if (selectedList) {
      if (selectedList.recipes.some((r) => r.id === this.recipe.id)) {
        this.alertRecipeDuplicate();
        return;
      }

      selectedList.recipes.push(this.recipe);

      this.mainSub.add(
        this.userService.editUser(this.commonUser).subscribe({
          next: () => {
            this.alertRecetaAdd();
            this.router.navigate(['/home']);
          },
          error: (error: Error) => {
            console.log('Error saving recipe:', error.message);
          },
        })
      );
    } else {
      console.error('Selected list not found');
    }
  }

  // Lógica de "saveAnotations" (Modo Usuario)
  saveAnotations() {
    if (this.formAnotations.invalid) return;
    const anotation = this.formAnotations.get('anotations')?.value;

    this.recipe.anotations = anotation;

    this.mainSub.add(
      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          this.alertAnotationSaved();
        },
        error: (error: Error) => {
          console.log('Error saving anotations: ', error.message);
        },
      })
    );
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
      anotations: '',
    };
  }

  mapExtendedIngredients(extendedIngredients: ExtendedIngredient): Ingredients {
    return {
      id: extendedIngredients.id,
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
      title: 'Recipe added to list',
    });
  }

  alertRecipeDuplicate() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
    Toast.fire({
      icon: 'warning',
      title: 'The recipe is already on that list',
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

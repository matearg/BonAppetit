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
import { forkJoin, Observable, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  private mainSub = new Subscription();
  recipe!: RecipeInfo;
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  listAddActive: boolean = false;
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);

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
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    // 1. Observable que busca la receta
    const recipe$ = this.recipeService.getRecipeInfotmation(id);

    // 2. Observable que busca al usuario (usando nuestro método refactorizado)
    const user$ = this.obtainUser();

    // 3. forkJoin: Ejecuta ambos en paralelo.
    // Solo emite un valor cuando AMBOS se completan.
    const combinedLoad$ = forkJoin({
      recipeData: recipe$,
      userData: user$,
    });

    // 4. Hacemos UNA SOLA suscripción y la añadimos a nuestro gestor
    this.mainSub.add(
      combinedLoad$.subscribe({
        next: (results) => {
          // results es { recipeData: RecipeInfo, userData: User }
          this.recipe = results.recipeData;
          this.commonUser = results.userData;

          // ¡Avisamos a Angular UNA SOLA VEZ!
          this.cdr.markForCheck();
        },
        error: (error: Error) => console.log('Error loading page data', error.message),
      })
    );
  }

  ngOnDestroy(): void {
    this.mainSub.unsubscribe();
  }

  getInstructions() {
    if (!this.recipe?.instructions) return [];
    const cleanText = this.recipe.instructions.replace(/<\/?[^>]+(>|$)/g, '');
    return cleanText.split('\n').filter((step) => step.trim() !== '');
  }

  obtainUser(): Observable<User> {
    return this.userService.getActiveUser().pipe(
      switchMap((userArray) => {
        this.activeUser = userArray[0];
        // switchMap cambia al siguiente observable
        return this.userService.getUserById(this.activeUser.id);
      })
    );
  }

  addRecipe() {
    const recipe = this.mapRecipeInfo(this.recipe);
    const listId = this.form.get('listId')?.value;
    console.log('Selected List ID:', listId);

    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));
    console.log(selectedList);

    if (selectedList) {
      selectedList.recipes.push(recipe);

      // Añade esta suscripción al gestor principal
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

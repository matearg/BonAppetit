import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeInfo } from '../../interfaces/recipe';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { RecipeCard } from '../recipe-card/recipe-card';
import { Subscription, switchMap, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-recipe-list',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, RecipeCard],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList implements OnDestroy {
  recipeService = inject(RecipeService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  recipeList: RecipeInfo[] = [];
  ingredients: string = '';
  recipeContainerActive = false;
  modelRecipeId: number = 0;

  form = this.formBuilder.nonNullable.group({
    ingredients: ['', Validators.required],
  });

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setIngredients() {
    if (this.form.invalid) {
      console.log('Invalid form');
      return;
    }

    const ingredintsForm: string = this.form.get('ingredients')?.value || '';
    this.ingredients = ingredintsForm;
    this.listRecipesByIngredients(ingredintsForm);
  }

  listRecipesByIngredients(ingredients: string) {
    // Añade la suscripción al gestor
    this.sub.add(
      this.recipeService.getrecipesByIngredients(ingredients, 6).subscribe({
        next: (data) => {
          console.log(ingredients);
          console.log(data);
          this.recipeList = data;
          this.cdr.markForCheck(); // Sigue necesitando esto
        },
        error: (error: Error) => {
          console.log('Error downloading recipes', error.message);
        },
      })
    );
  }

  updateRecipes() {
    if (this.recipeList.length == 0) {
      console.log('No similar recipes found.');
      return;
    }

    this.modelRecipeId = this.recipeList[0].id;
    const modelId = this.modelRecipeId;

    // Añade la suscripción al gestor
    this.sub.add(
      this.recipeService.getSimilarRecipes(modelId, 6).pipe(
        switchMap((similarRecipes: any[]) => {
          if (!similarRecipes || similarRecipes.length === 0) {
            return of([]);
          }
          const completeRecipeObservables$ = similarRecipes.map((recipe: any) => this.recipeService.getRecipeInfotmation(recipe.id));
          return forkJoin(completeRecipeObservables$);
        })
      ).subscribe({
        next: (recipes: RecipeInfo[]) => {
          this.recipeList = recipes;
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          console.log('updateRecipes Error:', error.message);
        }
      })
    )
  }

  recipe?: RecipeInfo;
  getRecipeInformation(id: number) {
    // Añade la suscripción al gestor
    this.sub.add(
      this.recipeService.getRecipeInfotmation(id).subscribe({
        next: (data) => {
          console.log(data);
          this.recipe = data;
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          console.log(error.message);
        },
      })
    );
  }

  navigateToDetails(id: number) {
    this.router.navigate([`/recipes-details/${id}`]);
  }
}

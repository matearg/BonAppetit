import { Component, inject } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeInfo } from '../../interfaces/recipe';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { RecipeCard } from '../recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-list',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, RecipeCard],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList {
  recipeService = inject(RecipeService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  recipeList: RecipeInfo[] = [];
  ingredients: string = '';
  recipeContainerActive = false;
  modelRecipeId: number | string | undefined = 0;

  form = this.formBuilder.nonNullable.group({
    ingredients: ['', Validators.required],
  });

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
    this.recipeService.getrecipesByIngredients(ingredients, 5).subscribe({
      next: (data) => {
        console.log(ingredients);
        console.log(data);
        this.recipeList = data;
      },
      error: (error: Error) => {
        console.log('Error downloading recipes', error.message);
      },
    });
  }

  updateRecipes() {
    this.modelRecipeId = this.recipeList[0].id;
    const modelId = this.modelRecipeId;

    this.recipeService.getSimilarRecipes(modelId, 5).subscribe({
      next: (similarRecipes) => {
        const completeRecipes = similarRecipes.map((recipe: any) =>
          this.recipeService.getRecipeInfotmation(recipe.id).toPromise()
        );

        Promise.all(completeRecipes)
          .then((recipes) => {
            this.recipeList = recipes; // Ahora `listaRecetas` tendrá recetas con imágenes y más detalles
          })
          .catch((error) => console.log(error));
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
  }

  recipe?: RecipeInfo;
  getRecipeInformation(id: number) {
    this.recipeService.getRecipeInfotmation(id).subscribe({
      next: (data) => {
        console.log(data);
        this.recipe = data;
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
  }

  navigateToDetails(id: number | string | undefined) {
    this.router.navigate([`/recipes-details/${id}`]);
  }
}

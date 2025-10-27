import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments.development';
import { Recipe, RecipeInfo } from '../interfaces/recipe';
import { RandomRecipe } from '../interfaces/random-recipe';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  constructor() {}

  http = inject(HttpClient);
  private key = environment.tokenLaura2;
  private baseUrl = 'http://localhost:3001/recetas';

  getRecetasByIngredients(ingredients: string, number: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.key,
    });

    const ignorePantry: boolean = true;
    const params = { ingredients, number, ignorePantry };
    const url = 'https://api.spoonacular.com/recipes/findByIngredients';

    return this.http.get(url, { headers, params });
  }

  getSimilarRecipes(id: number, number: number): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.key,
    });

    const params = { id, number };
    const url = `https://api.spoonacular.com/recipes/${id}/similar`;

    return this.http.get(url, { headers, params });
  }

  getRecipeInfotmation(id: number): Observable<RecipeInfo> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.key,
    });

    const includeNutrition: boolean = false;
    const addWinePairing: boolean = false;
    const addTasteData: boolean = false;

    const params = { id, includeNutrition, addWinePairing, addTasteData };
    const url = `https://api.spoonacular.com/recipes/${id}/information`;

    return this.http.get<RecipeInfo>(url, { headers, params });
  }

  getRandomRecipe(number: number = 1, includeNutrition: boolean = false): Observable<RandomRecipe> {
    const params = new HttpParams()
      .set('number', number.toString())
      .set('includeNutrition', includeNutrition.toString());

    // Create headers with the API key
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.key, // La clave API de Spoonacular
    });
    const url = `https://api.spoonacular.com/recipes/random`;
    // Hacer la solicitud GET con parámetros y headers
    return this.http.get<RandomRecipe>(url, { headers, params });
  }
  getRecetas(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl);
  }

  postRectea(Recipe: Recipe): Observable<Recipe> {
    return this.http.post<Recipe>(this.baseUrl, Recipe);
  }

  updateRecipe(idRecipe: number, Recipe: Recipe): Observable<Recipe> {
    return this.http.put<Recipe>(`${this.baseUrl}/${idRecipe}`, Recipe);
  }

  deleteRecipe(idRecipe: number): Observable<Recipe> {
    return this.http.delete<Recipe>(`${this.baseUrl}/${idRecipe}`);
  }
}

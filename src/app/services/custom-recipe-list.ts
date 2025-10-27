import { inject, Injectable } from '@angular/core';
import { CustomRecipeList, RecipeInfo } from '../interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomRecipeListService {
  constructor() {}

  url: string = 'http://localhost:3000/listasPersonalizadas';

  http = inject(HttpClient);

  // Obtener todas las listas
  getListas(): Observable<CustomRecipeList[]> {
    return this.http.get<CustomRecipeList[]>(this.url);
  }

  getListabyId(id: string): Observable<CustomRecipeList> {
    return this.http.get<CustomRecipeList>(`${this.url}/${id}`);
  }

  // Crear una nueva lista
  addLista(lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.post<CustomRecipeList>(this.url, lista);
  }

  postLista(lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.post<CustomRecipeList>(this.url, lista);
  }

  // Actualizar una lista
  updateLista(idLista: string, lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.put<CustomRecipeList>(`${this.url}/${idLista}`, lista);
  }

  // Eliminar una lista
  deleteLista(idLista: string): Observable<CustomRecipeList> {
    return this.http.delete<CustomRecipeList>(`${this.url}/${idLista}`);
  }
}

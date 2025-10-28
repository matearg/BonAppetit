import { inject, Injectable } from '@angular/core';
import { CustomRecipeList } from '../interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomRecipeListService {
  constructor() { }

  url: string = 'http://localhost:3000/CustomRecipeList';

  http = inject(HttpClient);

  // Obtener todas las listas
  getLists(): Observable<CustomRecipeList[]> {
    return this.http.get<CustomRecipeList[]>(this.url);
  }

  getListbyId(id: string): Observable<CustomRecipeList> {
    return this.http.get<CustomRecipeList>(`${this.url}/${id}`);
  }

  // Crear una nueva lista
  addList(lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.post<CustomRecipeList>(this.url, lista);
  }

  postList(lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.post<CustomRecipeList>(this.url, lista);
  }

  // Actualizar una lista
  updateList(id: string, lista: CustomRecipeList): Observable<CustomRecipeList> {
    return this.http.put<CustomRecipeList>(`${this.url}/${id}`, lista);
  }

  // Eliminar una lista
  deleteList(id: string): Observable<CustomRecipeList> {
    return this.http.delete<CustomRecipeList>(`${this.url}/${id}`);
  }
}

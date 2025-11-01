import { inject, Injectable } from '@angular/core';
import { CustomRecipeLists } from '../interfaces/recipe';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomRecipeListService {
  constructor() {}

  url: string = 'http://localhost:3000/CustomRecipeList';

  http = inject(HttpClient);

  // Obtener todas las listas
  getLists(): Observable<CustomRecipeLists[]> {
    return this.http.get<CustomRecipeLists[]>(this.url);
  }

  getListbyId(id: string): Observable<CustomRecipeLists> {
    return this.http.get<CustomRecipeLists>(`${this.url}/${id}`);
  }

  // Crear una nueva lista
  addList(lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.post<CustomRecipeLists>(this.url, lista);
  }

  postList(lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.post<CustomRecipeLists>(this.url, lista);
  }

  // Actualizar una lista
  updateList(id: string, lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.put<CustomRecipeLists>(`${this.url}/${id}`, lista);
  }

  // Eliminar una lista
  deleteList(id: string): Observable<CustomRecipeLists> {
    return this.http.delete<CustomRecipeLists>(`${this.url}/${id}`);
  }
}

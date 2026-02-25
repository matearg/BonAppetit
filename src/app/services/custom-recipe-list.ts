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

  getLists(): Observable<CustomRecipeLists[]> {
    return this.http.get<CustomRecipeLists[]>(this.url);
  }

  getListbyId(id: string): Observable<CustomRecipeLists> {
    return this.http.get<CustomRecipeLists>(`${this.url}/${id}`);
  }

  addList(lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.post<CustomRecipeLists>(this.url, lista);
  }

  postList(lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.post<CustomRecipeLists>(this.url, lista);
  }

  updateList(id: string, lista: CustomRecipeLists): Observable<CustomRecipeLists> {
    return this.http.put<CustomRecipeLists>(`${this.url}/${id}`, lista);
  }

  deleteList(id: string): Observable<CustomRecipeLists> {
    return this.http.delete<CustomRecipeLists>(`${this.url}/${id}`);
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnailUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  http = inject(HttpClient);

  getYouTubeRecipes(prompt: string): Observable<YouTubeVideo[]> {
    // Este endpoint de tu Node.js debe devolver el array de videos
    const url = 'http://localhost:3001/api/youtube-recipes';
    return this.http.post<YouTubeVideo[]>(url, { prompt });
  }
}

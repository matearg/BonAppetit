import { ChangeDetectorRef, Component, inject, OnDestroy } from '@angular/core';
import { RecipeService } from '../../services/recipe-service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { Subscription } from 'rxjs';

export interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnailUrl: string;
}

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-list.html',
  styleUrl: './recipe-list.css',
})
export class RecipeList implements OnDestroy {
  recipeService = inject(RecipeService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  videoList: YouTubeVideo[] = [];
  isSearching = false;

  form = this.formBuilder.nonNullable.group({
    searchQuery: ['', Validators.required],
  });

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  searchVideos() {
    if (this.form.invalid) return;

    this.isSearching = true;
    this.videoList = [];
    this.cdr.markForCheck();

    const userQuery = this.form.get('searchQuery')?.value || '';

    this.sub.add(
      this.recipeService.getYouTubeRecipes(userQuery).subscribe({
        next: (videos: YouTubeVideo[]) => {
          this.videoList = videos;
          this.isSearching = false;
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          console.error('Error fetching videos', error.message);
          this.isSearching = false;
          this.cdr.markForCheck();
        },
      }),
    );
  }

  goToVideo(video: YouTubeVideo) {
    this.router.navigate([`/recipes-details/${video.videoId}`], { state: { videoData: video } });
  }
}

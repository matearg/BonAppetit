import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import { Recipe } from '../../interfaces/recipe';
import { Subscription, switchMap } from 'rxjs';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-list-details',
  imports: [HomePageHeader, Footer],
  templateUrl: './list-details.html',
  styleUrl: './list-details.css',
})
export class ListDetails implements OnInit, OnDestroy {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  listId: number = 0;
  listName: string = '';
  recipes: Recipe[] = [];

  ngOnInit() {
    this.listId = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    this.sub.add(
      this.userService
        .getActiveUser()
        .pipe(switchMap((users) => this.userService.getUserById(users[0].id)))
        .subscribe((user) => {
          const foundList = user.recipeLists.find((l) => l.id === this.listId);
          if (foundList) {
            this.listName = foundList.name || 'Lista sin nombre';
            this.recipes = foundList.recipes;
          }
          this.cdr.markForCheck();
        }),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  goToDetails(recipeId: string) {
    // Navegamos al detalle enviando el ID de la lista y el de la receta
    this.router.navigate([`/recipes-details/${this.listId}/${recipeId}`]);
  }
}

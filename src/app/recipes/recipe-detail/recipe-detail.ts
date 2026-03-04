import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Recipe } from '../../interfaces/recipe';
import { UserService } from '../../services/user-service';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { catchError, Observable, of, Subscription, switchMap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [HomePageHeader, Footer, ReactiveFormsModule, CommonModule],
  templateUrl: './recipe-detail.html',
  styleUrl: './recipe-detail.css',
})
export class RecipeDetail implements OnInit, OnDestroy {
  private mainSub = new Subscription();
  recipe!: Recipe;
  userService = inject(UserService);
  formBuilder = inject(FormBuilder);
  listAddActive: boolean = false;
  cdr = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);

  isMyRecipe = false;
  videoUrl!: SafeResourceUrl;

  // 1. Variable para atrapar los datos a tiempo
  videoDataFromState: any = null;

  activeUser: ActiveUser = { id: 0, email: '' };
  commonUser: User = { email: '', password: '', recipeLists: [] };

  formAddToList = this.formBuilder.nonNullable.group({ listId: [0, Validators.required] });
  formAnotations = this.formBuilder.group({ anotations: ['', Validators.required] });

  currentListId: string | null = null;

  // 2. Atrapar los datos del router directamente en el constructor
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    const nav = this.router.currentNavigation();
    this.videoDataFromState = nav?.extras.state?.['videoData'];
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    const listIdParam = this.activatedRoute.snapshot.paramMap.get('idList');
    const recipeIdParam = this.activatedRoute.snapshot.paramMap.get('idRecipe');

    this.currentListId = listIdParam;

    if (listIdParam && recipeIdParam) {
      this.isMyRecipe = true;
      const listId = Number(listIdParam);

      this.mainSub.add(
        this.obtainUser().subscribe({
          next: (user) => {
            this.commonUser = user;
            this.loadUserRecipe(listId, recipeIdParam);
            if (this.recipe) {
              this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
                `https://www.youtube-nocookie.com/embed/${this.recipe.id}`,
              );
            }
            this.cdr.markForCheck();
          },
          error: (error: Error) => console.log('Error loading user recipe', error.message),
        }),
      );
    } else if (id) {
      this.isMyRecipe = false;

      // 3. Asignar los datos atrapados
      if (this.videoDataFromState) {
        this.recipe = {
          id: this.videoDataFromState.videoId,
          title: this.videoDataFromState.title,
          image: this.videoDataFromState.thumbnailUrl,
          anotations: '',
        };
      } else {
        this.recipe = {
          id: id,
          title: 'Receta de YouTube',
          image: 'img/logo.jpeg',
          anotations: '',
        };
      }

      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        `https://www.youtube-nocookie.com/embed/${this.recipe.id}`,
      );

      this.mainSub.add(
        this.obtainUser().subscribe({
          next: (user) => {
            this.commonUser = user;
            this.cdr.markForCheck();
          },
          error: (error: Error) => console.log('Error loading API recipe data', error.message),
        }),
      );
    }
  }

  private loadUserRecipe(listId: number, recipeId: string) {
    const list = this.commonUser.recipeLists.find((list) => list.id == listId);
    if (list) {
      const foundRecipe = list.recipes.find((recipe) => recipe.id === recipeId);
      if (foundRecipe) {
        this.recipe = foundRecipe;
        this.formAnotations.patchValue({ anotations: this.recipe.anotations });
      }
    }
  }

  ngOnDestroy(): void {
    this.mainSub.unsubscribe();
  }

  obtainUser(): Observable<User> {
    return this.userService.getActiveUser().pipe(
      switchMap((userArray) => {
        const activeUser = userArray[0];
        if (!activeUser) {
          this.router.navigate(['']);
          return throwError(() => new Error('No active user session'));
        }
        this.activeUser = activeUser;
        return this.userService.getUserById(this.activeUser.id);
      }),
      catchError((err) => {
        this.router.navigate(['']);
        return of(null as any);
      }),
    );
  }

  addRecipe() {
    const listId = this.formAddToList.get('listId')?.value;
    const selectedList = this.commonUser.recipeLists.find((list) => list.id === Number(listId));

    if (selectedList) {
      if (selectedList.recipes.some((r) => r.id === this.recipe.id)) {
        this.alertRecipeDuplicate();
        return;
      }
      selectedList.recipes.push(this.recipe);
      this.mainSub.add(
        this.userService.editUser(this.commonUser).subscribe({
          next: () => {
            this.alertRecetaAdd();
            this.router.navigate(['/home']);
          },
        }),
      );
    }
  }

  goToEditRecipe() {
    if (this.currentListId && this.recipe) {
      this.router.navigate(['/update-recipe', this.currentListId, this.recipe.id]);
    }
  }

  deleteRecipe() {
    if (!this.currentListId || !this.recipe) return;

    Swal.fire({
      title: 'Remove recipe?',
      text: 'It will get removed from your list.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#999',
      confirmButtonText: 'Yes, Remove',
      cancelButtonText: 'No, Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const listId = Number(this.currentListId);
        const list = this.commonUser.recipeLists.find((l) => l.id === listId);

        if (list) {
          // Filtramos el array para excluir la receta actual
          list.recipes = list.recipes.filter((r) => r.id !== this.recipe.id);

          this.mainSub.add(
            this.userService.editUser(this.commonUser).subscribe({
              next: () => {
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Removed recipe',
                  showConfirmButton: false,
                  timer: 1500,
                });
                // Redirigimos al usuario de vuelta a su lista
                this.router.navigate(['/list', listId]);
              },
              error: (err) => console.error('Error al eliminar', err),
            }),
          );
        }
      }
    });
  }

  saveAnotations() {
    if (this.formAnotations.invalid) return;
    this.recipe.anotations = this.formAnotations.get('anotations')?.value;
    this.mainSub.add(
      this.userService.editUser(this.commonUser).subscribe({
        next: () => this.alertAnotationSaved(),
      }),
    );
  }

  alertRecetaAdd() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Recipe added to list',
      showConfirmButton: false,
      timer: 1400,
    });
  }
  alertRecipeDuplicate() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'warning',
      title: 'The recipe is already on that list',
      showConfirmButton: false,
      timer: 2000,
    });
  }
  alertAnotationSaved() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Anotations saved successfully',
      showConfirmButton: false,
      timer: 1400,
    });
  }
}

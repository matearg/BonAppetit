import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user-service';
import { CustomRecipeLists, Recipe } from '../../interfaces/recipe';
import { CustomRecipeListService } from '../../services/custom-recipe-list';
import Swal from 'sweetalert2';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-custom-recipe-list',
  standalone: true,
  imports: [HomePageHeader, Footer, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './custom-recipe-list.html',
  styleUrl: './custom-recipe-list.css',
})
export class CustomRecipeList implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  activeUser: ActiveUser = { id: 0, email: '' };
  commonUser: User = { email: '', password: '', recipeLists: [] };

  userService = inject(UserService);
  lists: CustomRecipeLists[] = [];
  customRecipeListService = inject(CustomRecipeListService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  listName? = '';
  recipeArray: Recipe[] = [];

  form = this.formBuilder.nonNullable.group({
    listName: ['', Validators.required],
  });

  ngOnInit(): void {
    this.sub.add(
      this.userService
        .getActiveUser()
        .pipe(
          switchMap((userArray) => {
            this.activeUser = userArray[0];
            return this.userService.getUserById(this.activeUser.id);
          }),
          tap((user) => {
            this.commonUser = user;
            this.cdr.markForCheck();
          }),
        )
        .subscribe({
          error: (error: Error) => console.log(error.message),
        }),
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  setListName() {
    if (this.form.invalid) return;
    this.listName = this.form.get('listName')?.value || '';
  }

  listPost() {
    this.setListName();
    const existingId = this.commonUser.recipeLists.map((list) => list.id);
    const maxId = existingId.length > 0 ? Math.max(...existingId) : -1;
    const newId = maxId + 1;

    const newList: CustomRecipeLists = {
      id: newId,
      name: this.listName,
      recipes: [], // Lista vacía al inicio
    };

    this.commonUser.recipeLists.push(newList);
    this.sub.add(
      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          this.alertRecipeListCreated();
          this.router.navigate(['/my-lists']);
        },
        error: (error: Error) => console.log(error.message),
      }),
    );
  }

  deleteList(id: string) {
    this.sub.add(
      this.customRecipeListService.deleteList(id).subscribe({
        next: () => this.cdr.markForCheck(),
        error: (error: Error) => console.log(error.message),
      }),
    );
  }

  alertRecipeListCreated() {
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'List created successfully',
      showConfirmButton: false,
      timer: 2000,
    });
  }
}

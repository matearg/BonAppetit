import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { UserService } from '../../services/user-service';
import { CustomRecipeLists, ExtendedIngredient, RecipeInfo } from '../../interfaces/recipe';
import { CustomRecipeListService } from '../../services/custom-recipe-list';
import Swal from 'sweetalert2';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-custom-recipe-list',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './custom-recipe-list.html',
  styleUrl: './custom-recipe-list.css',
})
export class CustomRecipeList implements OnInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();
  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  userService = inject(UserService);
  lists: CustomRecipeLists[] = [];
  customRecipeListService = inject(CustomRecipeListService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);

  listName? = '';
  recipeArray: RecipeInfo[] = [];
  ingredientsArray: ExtendedIngredient[] = [];

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // --- 4. REFACTORIZA ngOnInit CON BUENAS PRÁCTICAS ---
    this.sub.add(
      // Añade esta cadena al gestor
      this.userService
        .getActiveUser()
        .pipe(
          // Usa switchMap para evitar anidar
          switchMap((userArray) => {
            this.activeUser = userArray[0];
            return this.userService.getUserById(this.activeUser.id);
          }),
          // Usa tap para asignar el valor y avisar a Angular
          tap((user) => {
            this.commonUser = user;
            this.cdr.markForCheck(); // ¡Avisa a Angular!
          })
        )
        .subscribe({
          next: () => console.log('Usuario cargado para CustomRecipeList'),
          error: (error: Error) => console.log(error.message),
        })
    );
  }

  constructor() {}

  form = this.formBuilder.nonNullable.group({
    listName: ['', Validators.required],
  });

  setListName() {
    if (this.form.invalid) return;
    this.listName = this.form.get('listName')?.value || '';
  }

  listPost() {
    this.setListName();
    const newList: CustomRecipeLists = {
      id: this.commonUser.recipeLists.length + 1,
      name: this.listName,
      recipes: this.recipeArray.map((recipe) => ({
        ...recipe,
        ingredients: [],
      })),
    };
    this.commonUser.recipeLists.push(newList);
    this.sub.add(
      // Añade esta suscripción al gestor
      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          console.log('List created succesfully');
          this.alertRecipeListCreated();
          this.router.navigate(['/my-lists']);
        },
        error: (error: Error) => {
          console.log(error.message);
        },
      })
    );
  }

  deleteList(id: string) {
    // --- 6. GESTIONA LA SUSCRIPCIÓN DE deleteList ---
    this.sub.add(
      // Añade esta suscripción al gestor
      this.customRecipeListService.deleteList(id).subscribe({
        next: (list) => {
          console.log('Deleted list', list);
          this.cdr.markForCheck();
        },
        error: (error: Error) => {
          console.log(error.message);
        },
      })
    );
  }

  alertRecipeListCreated() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Lista creada con exito',
    });
  }
}

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; // Inyectamos ActivatedRoute
import { UserService } from '../../services/user-service';
import { User } from '../../interfaces/user';
import { Recipe } from '../../interfaces/recipe';
import Swal from 'sweetalert2';
import { Subscription, switchMap } from 'rxjs';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-recipe-form',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './recipe-form.html',
  styleUrl: './recipe-form.css',
})
export class RecipeForm implements OnInit, OnDestroy {
  formBuilder = inject(FormBuilder);
  userService = inject(UserService);
  router = inject(Router);
  route = inject(ActivatedRoute); // Para leer la URL
  private sub = new Subscription();

  commonUser: User = { email: '', password: '', recipeLists: [] };

  // Variables para el modo edición
  isEditMode = false;
  editRecipeId = '';
  originalListId = 0;

  form = this.formBuilder.group({
    title: ['', Validators.required],
    ingredients: ['', Validators.required],
    instructions: ['', Validators.required],
    listId: ['', Validators.required],
  });

  ngOnInit() {
    this.sub.add(
      this.userService
        .getActiveUser()
        .pipe(switchMap((users) => this.userService.getUserById(users[0].id)))
        .subscribe((user) => {
          this.commonUser = user;
          this.checkEditMode(); // Verificamos si es edición después de cargar el usuario
        }),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  checkEditMode() {
    const idList = this.route.snapshot.paramMap.get('idList');
    const idRecipe = this.route.snapshot.paramMap.get('idRecipe');

    if (idList && idRecipe) {
      this.isEditMode = true;
      this.originalListId = Number(idList);
      this.editRecipeId = idRecipe;

      const list = this.commonUser.recipeLists.find((l) => l.id === this.originalListId);
      if (list) {
        const recipe = list.recipes.find((r) => r.id === this.editRecipeId);
        if (recipe) {
          // Rellenamos el formulario con los datos existentes
          this.form.patchValue({
            title: recipe.title,
            ingredients: recipe.ingredients?.join('\n') || '', // Convertimos array a texto
            instructions: recipe.instructions || '',
            listId: this.originalListId.toString(),
          });
          // Bloqueamos el selector de lista para evitar mover la receta entre listas y simplificar la lógica
          this.form.get('listId')?.disable();
        }
      }
    }
  }

  onSubmit() {
    if (this.form.invalid) return;

    // getRawValue() incluye campos disabled (como el listId en modo edición)
    const formValue = this.form.getRawValue();

    if (this.isEditMode) {
      // Actualizamos la receta existente
      const list = this.commonUser.recipeLists.find((l) => l.id === this.originalListId);
      if (list) {
        const recipeIndex = list.recipes.findIndex((r) => r.id === this.editRecipeId);
        if (recipeIndex !== -1) {
          list.recipes[recipeIndex] = {
            ...list.recipes[recipeIndex],
            title: formValue.title!,
            ingredients: formValue.ingredients!.split('\n'), // Convertimos texto a array
            instructions: formValue.instructions!,
          };
        }
      }
    } else {
      // Lógica de creación original
      const selectedList = this.commonUser.recipeLists.find(
        (l) => l.id === Number(formValue.listId),
      );
      if (!selectedList) return;

      const newRecipe: Recipe = {
        id: 'custom-' + Date.now().toString(),
        title: formValue.title!,
        image: 'img/logo.jpeg',
        isCustom: true,
        ingredients: formValue.ingredients!.split('\n'),
        instructions: formValue.instructions!,
        anotations: '',
      };
      selectedList.recipes.push(newRecipe);
    }

    this.sub.add(
      this.userService.editUser(this.commonUser).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: this.isEditMode ? 'Receta actualizada' : 'Receta creada',
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/my-lists']);
      }),
    );
  }
}

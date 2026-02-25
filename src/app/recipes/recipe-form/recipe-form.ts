import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
  private sub = new Subscription();
  commonUser!: User;

  form = this.formBuilder.group({
    title: ['', Validators.required],
    ingredients: ['', Validators.required],
    instructions: ['', Validators.required],
    listId: [0, [Validators.required, Validators.min(1)]],
  });

  ngOnInit() {
    this.sub.add(
      this.userService
        .getActiveUser()
        .pipe(switchMap((users) => this.userService.getUserById(users[0].id)))
        .subscribe((user) => (this.commonUser = user)),
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;
    const selectedList = this.commonUser.recipeLists.find((l) => l.id == formValue.listId);

    if (!selectedList) return;

    // Creamos el objeto de receta personalizada
    const newRecipe: Recipe = {
      id: 'custom-' + Date.now().toString(), // ID único autogenerado
      title: formValue.title!,
      image: 'img/logo.jpeg', // Usamos tu logo como imagen por defecto
      isCustom: true,
      ingredients: formValue.ingredients!.split('\n'), // Separamos por saltos de línea
      instructions: formValue.instructions!,
      anotations: '',
    };

    selectedList.recipes.push(newRecipe);

    this.sub.add(
      this.userService.editUser(this.commonUser).subscribe(() => {
        Swal.fire({
          icon: 'success',
          title: 'Receta creada',
          timer: 1500,
          showConfirmButton: false,
        });
        this.router.navigate(['/my-lists']);
      }),
    );
  }
}

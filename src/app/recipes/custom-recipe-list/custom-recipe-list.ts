import { Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-custom-recipe-list',
  imports: [HomePageHeader, Footer, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './custom-recipe-list.html',
  styleUrl: './custom-recipe-list.css',
})
export class CustomRecipeList implements OnInit {
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

  ngOnInit(): void {
    this.userService.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        this.userService.getUserById(this.activeUser.id).subscribe({
          next: (user) => {
            this.commonUser = user;
          },
          error: (error: Error) => {
            console.log(error.message);
          },
        });
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
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
    this.userService.editUser(this.commonUser).subscribe({
      next: () => {
        console.log('List created succesfully');
        this.alertRecipeListCreated();
        this.router.navigate(['/my-lists']);
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
  }

  deleteList(id: string) {
    this.customRecipeListService.deleteList(id).subscribe({
      next: (list) => {
        console.log('Deleted list', list);
      },
      error: (error: Error) => {
        console.log(error.message);
      },
    });
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

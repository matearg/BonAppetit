import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CustomRecipeLists } from '../../interfaces/recipe';
import { CustomRecipeListService } from '../../services/custom-recipe-list';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { CommonModule } from '@angular/common';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-my-lists',
  imports: [HomePageHeader, Footer, RouterLink, CommonModule],
  templateUrl: './my-lists.html',
  styleUrl: './my-lists.css',
})
export class MyLists implements OnInit {
  lists: CustomRecipeLists[] = [];
  customRecipesListService = inject(CustomRecipeListService);
  router = inject(Router);
  userService = inject(UserService);
  cdr = inject(ChangeDetectorRef);

  activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  ngOnInit(): void {
    this.userService
      .getActiveUser()
      .pipe(
        // switchMap toma el resultado del primer observable (userArray)
        // y retorna un *nuevo* observable (la llamada a getUserById)
        switchMap((userArray) => {
          this.activeUser = userArray[0];
          return this.userService.getUserById(this.activeUser.id);
        }),
        // tap te permite ejecutar código "de paso" sin afectar el stream
        tap((user) => {
          this.commonUser = user;
          this.lists = this.commonUser.recipeLists;
          this.showNLists();

          // Todavía necesitas esto si usas OnPush
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        // Solo necesitas un subscribe y un manejo de error
        error: (error: Error) => {
          console.log('Error en el stream de carga:', error.message);
        },
      });
  }

  showNLists() {
    if (this.lists && this.lists.length > 0) {
      this.lists.forEach((list, index) => {
        console.log(`Custom list ${index + 1}:`, list);
      });
    } else {
      console.log('No lists to show.');
    }
  }

  seeListDetails(id: number) {
    if (this.lists.some((u) => u.id === id)) {
      this.router.navigate([[`list/${id}`]]);
    }
  }

  deleteList(id: number) {
    if (this.lists.some((list) => list.id === id)) {
      this.commonUser.recipeLists = this.lists.filter((list) => list.id !== id);

      this.userService.editUser(this.commonUser).subscribe({
        next: () => {
          this.lists = [...this.commonUser.recipeLists];
          this.alertDeleteRecipe();
        },
        error: (error: Error) => {
          console.error('Error on list deletion:', error.message);
        },
      });
    } else {
      console.log('List not found');
    }
  }

  alertDeleteRecipe() {
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
      title: 'Lista eliminada con exito',
    });
  }
}

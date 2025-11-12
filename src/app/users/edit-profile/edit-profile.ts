import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-edit-profile',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit, OnDestroy {
  private router = inject(Router);
  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService = inject(UserService);
  private cdr = inject(ChangeDetectorRef);
  private sub = new Subscription();

  private activeUser: ActiveUser = {
    id: 0,
    email: '',
  };

  private commonUser: User = {
    email: '',
    password: '',
    recipeLists: [],
  };

  editForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.sub.add(
      // Añade al gestor
      this.userService
        .getActiveUser()
        .pipe(
          // Usa switchMap para aplanar
          switchMap((user) => {
            this.activeUser = user[0];
            return this.userService.getUserById(this.activeUser.id);
          }),
          // Usa tap para asignar y avisar
          tap((user) => {
            this.commonUser = user;

            // Retrasa el patchValue al siguiente ciclo
            setTimeout(() => {
              this.editForm.patchValue({
                email: this.commonUser.email,
                password: this.commonUser.password,
              });
            }, 0);

            this.cdr.markForCheck();
          })
        )
        .subscribe({
          next: () => console.log('Usuario cargado para editar perfil'),
          error: (error: Error) => console.log(error.message),
        })
    );
  }

  editProfile(): void {
    if (this.editForm.valid) {
      const updatedUser: User = {
        ...this.commonUser,
        email: this.editForm.value.email!,
        password: this.editForm.value.password!,
      };

      this.sub.add(
        this.userService.editUser(updatedUser).subscribe({
          next: () => {
            this.alertProfileEdit();
            console.log('Update profile success');
            this.router.navigate(['profile']);
          },
          error: (error: Error) => {
            console.log('Error on profile update: ', error.message);
          },
        })
      );
    } else {
      console.log('Invalid form');
    }
  }

  alertProfileEdit() {
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
      title: 'Saved profile changes',
    });
  }
}

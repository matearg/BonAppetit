import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import Swal from 'sweetalert2';
import { HomePageHeader } from '../../views/headers/home-page-header/home-page-header';
import { Footer } from '../../views/shared/footer/footer';

@Component({
  selector: 'app-edit-profile',
  imports: [HomePageHeader, Footer, ReactiveFormsModule],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css',
})
export class EditProfile implements OnInit {
  private router = inject(Router);
  private activeUser: ActiveUser = {
    id: 0,
    email: ''
  };

  private commonUser: User = {
    email: '',
    password: '',
    recipeList: []
  };

  private formBuilder: FormBuilder = inject(FormBuilder);
  private userService = inject(UserService);

  editForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnInit(): void {
    this.userService.getActiveUser().subscribe({
      next: (user) => {
        this.activeUser = user[0];
        this.userService.getUserById(this.activeUser.id).subscribe({
          next: (user) => {
            this.commonUser = user;
            this.editForm.patchValue({
              email: this.commonUser.email,
              password: this.commonUser.password
            });
          },
          error: (error: Error) => {
            console.log(error.message);
          }
        })
      },
      error: (error: Error) => {
        console.log(error.message);
      }
    })
  }

  editProfile(): void {
    if (this.editForm.valid) {
      const updatedUser: User = {
        ...this.commonUser,
        email: this.editForm.value.email!,
        password: this.editForm.value.password!
      };

      this.userService.editUser(updatedUser).subscribe({
        next: () => {
          this.alertProfileEdit();
          console.log('Update profile success');
          this.router.navigate(['profile']);
        },
        error: (error: Error) => {
          console.log('Error on profile update: ', error.message);
        }
      });
    } else {
      console.log('Invalid form');
    }
  }

  alertProfileEdit() {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      }
    });
    Toast.fire({
      icon: "success",
      title: "Cambios guardados"
    });
  }
}

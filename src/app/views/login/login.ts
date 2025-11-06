import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';
import { User } from '../../interfaces/user';
import { ActiveUser } from '../../interfaces/active-user';
import { CustomRecipeLists } from '../../interfaces/recipe';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnDestroy {
  private formBuilder: FormBuilder = inject(FormBuilder);
  private authService = inject(UserService);
  private router = inject(Router);
  urlUsers = 'http://localhost:3000/Users';
  isActive = false;

  private sub = new Subscription();

  activeLogin() {
    this.isActive = false;
  }

  loginForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onSubmitLogin() {
    if (this.loginForm.invalid) return;
    const { email, password } = this.loginForm.getRawValue();

    this.sub.add(
      this.authService.loginChat(email!, password!).subscribe({
        next: (user) => {
          if (user) {
            const token = btoa(user.email);
            localStorage.setItem('token', token);
            this.asignActiveUser(user);
            this.loginAlertSucces();
            this.router.navigate(['home']);
          } else {
            this.loginForm.controls['password'].setErrors({ incorrect: true });
            this.loginAlertError();
          }
        },
      })
    );
  }

  asignActiveUser(user: User) {
    const activeUser: ActiveUser = { id: user.id!, email: user.email };

    this.sub.add(
      this.authService.postActiveUser(activeUser).subscribe({
        next: (user) => {
          console.log('Usuario en sesión:', user);
        },
        error: (e: Error) => {
          console.log(e.message);
        },
      })
    );
  }

  activeRegister() {
    this.isActive = true;
  }

  registerForm = this.formBuilder.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });

  initialList: CustomRecipeLists = {
    id: 0,
    name: 'Favoritos',
    recipes: [],
  };

  initialLists: CustomRecipeLists[] = [this.initialList];

  onSubmitRegister() {
    if (this.registerForm.invalid) {
      return;
    }
    const formValues = this.registerForm.getRawValue();

    const email = formValues.email;

    this.sub.add(
      this.authService.checkEmailExists(email).subscribe({
        next: (emailExists) => {
          if (emailExists) {
            this.registerAlertUsedEmail();
          } else {
            const user: User = {
              email: formValues.email ?? '',
              password: formValues.password ?? '',
              recipeLists: this.initialLists,
            };

            // --- 6. GESTIONA LA SUSCRIPCIÓN (ANIDADA) ---
            this.sub.add(
              this.authService.signup(user).subscribe({
                next: () => {
                  this.registerAlertCreated();
                  this.router.navigate(['/']);
                },
                error: (error) => {
                  console.error(error);
                  console.log('Redirecting to Home');
                  setTimeout(() => {
                    this.router.navigate(['/']);
                  }, 1500);
                },
              })
            );
          }
        },
        error: (error) => {
          console.error('Error checking email: ', error);
        },
      })
    );
  }

  revealLoginPw = false;
  revealRegisterPw = false;

  onRevealPassword(pwInput: HTMLInputElement, formType: 'login' | 'register') {
    const isText = pwInput.type === 'password';
    pwInput.type = isText ? 'text' : 'password';

    if (formType === 'login') {
      this.revealLoginPw = isText;
    } else {
      this.revealRegisterPw = isText;
    }
  }

  loginAlertSucces() {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1400,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title: 'Acceso correcto',
    });
  }

  loginAlertError() {
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
      icon: 'error',
      title: 'Usuario o contraseña incorrectos',
    });
  }

  registerAlertCreated() {
    Swal.fire({
      title: 'Usuario creado con exito',
      text: '',
      icon: 'success',
    });
  }

  registerAlertUsedEmail() {
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
      icon: 'error',
      title: 'Este correo ya esta en uso',
    });
  }
}

import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HomePageHeader } from '../headers/home-page-header/home-page-header';
import { Footer } from '../shared/footer/footer';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { ActiveUser } from '../../interfaces/active-user';
import { User } from '../../interfaces/user';
import { Subscription, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-profile',
  imports: [HomePageHeader, Footer, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit, OnDestroy {
  private service = inject(UserService);
  profileImage = 'img/user-profile.webp';
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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    // Añade la cadena al gestor de suscripciones
    this.sub.add(
      this.service
        .getActiveUser()
        .pipe(
          // 1. Usa switchMap para evitar anidar
          switchMap((userArray) => {
            this.activeUser = userArray[0];
            // Retorna el siguiente observable en la cadena
            return this.service.getUserById(this.activeUser.id);
          }),
          // 2. Usa tap para el "efecto secundario" (asignar el valor)
          tap((user) => {
            this.commonUser = user;
            this.cdr.markForCheck(); // Avisa a Angular
          })
        )
        .subscribe({
          // 3. Solo un subscribe y un manejo de error
          next: () => {
            console.log('Perfil de usuario cargado');
          },
          error: (error: Error) => {
            console.log(error.message);
          },
        })
    );
  }
}

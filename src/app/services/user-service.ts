import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActiveUser } from '../interfaces/active-user';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor() {}

  private activeUserSubject = new BehaviorSubject<ActiveUser | undefined>(undefined);
  urlUsuarios = 'http://localhost:3000/Usuarios';
  urlActivo = 'http://localhost:3000/UsuarioActivo';
  http = inject(HttpClient);

  auth(): Observable<ActiveUser | undefined> {
    return this.activeUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.urlUsuarios}?email=${email}`).pipe(
      map((users) => {
        const user = users.at(0);
        if (user && user.email === email && user.password === password) {
          this.activeUserSubject.next({ email: user.email, id: user.id! });
          localStorage.setItem('token', user.id?.toString()!);
          return user;
        }
        return null;
      }),
      catchError(() => of(null))
    );
  }

  loginChat(username: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.urlUsuarios}?username=${username}`).pipe(
      map((users) => {
        // Buscar el usuario que coincida tanto en el nombre de usuario como en la contraseña
        const user = users.find((u) => u.email === username && u.password === password);
        if (user) {
          this.activeUserSubject.next({ email: user.email, id: user.id! });
          localStorage.setItem('token', user.id?.toString()!);
          return user;
        }
        return null; // Si no encuentra el usuario, retorna null
      }),
      catchError(() => of(null))
    );
  }

  logout(): Observable<boolean> {
    this.activeUserSubject.next(undefined);
    return of(true);
  }

  signup(user: User): Observable<boolean> {
    return this.http.post<User>(this.urlUsuarios, user).pipe(
      map(({ id, email }) => {
        if (id) {
          this.activeUserSubject.next({ id, email });
          return true;
        }
        return false;
      })
    );
  }

  getUSerById(id: number): Observable<User> {
    return this.http.get<User>(`${this.urlUsuarios}/${id}`);
  }

  getUSer(): Observable<User[]> {
    return this.http.get<User[]>(this.urlUsuarios);
  }

  postActiveUser(user: ActiveUser): Observable<ActiveUser> {
    return this.http.post<ActiveUser>(this.urlActivo, user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.urlUsuarios}/${user.id}`, user);
  }

  getActiveUser(): Observable<ActiveUser[]> {
    return this.http.get<ActiveUser[]>(this.urlActivo);
  }

  deleteActiveUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.urlActivo}/${id}`);
  }

  clearActiveUser(): Observable<void> {
    //limpia el array de ActiveUser cuando se renderiza iniciar sesion.
    return this.http.get<any[]>(this.urlActivo).pipe(
      switchMap((usuarios) => {
        const userId = usuarios.length > 0 ? usuarios[0].id : null;
        return userId ? this.http.delete<void>(`${this.urlActivo}/${userId}`) : of();
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.urlUsuarios}?email=${email}`).pipe(
      map((users) => users.length > 0),
      catchError(() => of(false))
    );
  }
}

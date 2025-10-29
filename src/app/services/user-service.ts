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
  userUrl = 'http://localhost:3000/Users';
  activeUrl = 'http://localhost:3000/ActiveUser';
  http = inject(HttpClient);

  auth(): Observable<ActiveUser | undefined> {
    return this.activeUserSubject.asObservable();
  }

  login(email: string, password: string): Observable<User | null> {
    return this.http.get<User[]>(`${this.userUrl}?email=${email}`).pipe(
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
    return this.http.get<User[]>(`${this.userUrl}?username=${username}`).pipe(
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
    return this.http.post<User>(this.userUrl, user).pipe(
      map(({ id, email }) => {
        if (id) {
          this.activeUserSubject.next({ id, email });
          return true;
        }
        return false;
      })
    );
  }

  getUSerById(id: number | string | undefined): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${id}`);
  }

  getUSer(): Observable<User[]> {
    return this.http.get<User[]>(this.userUrl);
  }

  postActiveUser(user: ActiveUser): Observable<ActiveUser> {
    return this.http.post<ActiveUser>(this.activeUrl, user);
  }

  editUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.userUrl}/${user.id}`, user);
  }

  getActiveUser(): Observable<ActiveUser[]> {
    return this.http.get<ActiveUser[]>(this.activeUrl);
  }

  deleteActiveUser(id: number | string | undefined): Observable<void> {
    return this.http.delete<void>(`${this.activeUrl}/${id}`);
  }

  clearActiveUser(): Observable<void> {
    //limpia el array de ActiveUser cuando se renderiza iniciar sesion.
    return this.http.get<any[]>(this.activeUrl).pipe(
      switchMap((users) => {
        const userId = users.length > 0 ? users[0].id : null;
        return userId ? this.http.delete<void>(`${this.activeUrl}/${userId}`) : of();
      })
    );
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.userUrl}?email=${email}`).pipe(
      map((users) => users.length > 0),
      catchError(() => of(false))
    );
  }
}

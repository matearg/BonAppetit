import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../services/user-service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css',
})
export class NavBar implements OnDestroy {
  private userService = inject(UserService);
  private path = inject(Router);
  private sub = new Subscription();

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  obtainActiveUser() {
    this.sub.add(
      this.userService.getActiveUser().subscribe({
        next: (user) => {
          if (user.length > 0) {
            const id = user[0].id?.toString();
            this.logOut(id);
          } else {
            console.error('No active user found.');
          }
        },
        error: (error: Error) => {
          console.error('Error fetching active user:', error.message);
        },
      })
    )
  }

  logOut(id: string) {
    this.sub.add(
      this.userService.deleteActiveUser(id).subscribe({
        next: () => {
          console.log('Active user deleted successfully.');
          localStorage.removeItem('token');
          this.path.navigateByUrl('');
        },
        error: (error: Error) => {
          console.error('Error deleting active user:', error.message);
        },
      })
    )
  }

  goToProfile() {
    this.path.navigate(['profile']);
  }
}

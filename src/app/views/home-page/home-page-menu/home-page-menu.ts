import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page-menu',
  imports: [RouterModule],
  templateUrl: './home-page-menu.html',
  styleUrl: './home-page-menu.css',
})
export class HomePageMenu {
  router = inject(Router);

  viewRecipes() {
    this.router.navigate(['/recipes']);
  }
}

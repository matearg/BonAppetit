import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RecipeInfo } from '../../interfaces/recipe';

@Component({
  selector: 'app-recipe-card',
  imports: [],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  @Input() recipe!: RecipeInfo;
  @Output() viewDetails = new EventEmitter<number>();

  onViewDetails() {
    this.viewDetails.emit(this.recipe.id);
    console.log(this.recipe.id);
  }
}

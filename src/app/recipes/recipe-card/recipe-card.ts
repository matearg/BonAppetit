import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { RecipeInfo } from '../../interfaces/recipe';

@Component({
  selector: 'app-recipe-card',
  imports: [CommonModule],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCard {
  @Input() recipe!: RecipeInfo;
  @Output() viewDetails = new EventEmitter<number | string | undefined>()

  onViewDetails() {
    this.viewDetails.emit(this.recipe.id);
    console.log(this.recipe.id);
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Recipe, RecipeInfo } from '../../interfaces/recipe';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-delete-update-output',
  imports: [CommonModule, RouterModule],
  templateUrl: './delete-update-output.html',
  styleUrl: './delete-update-output.css',
})
export class DeleteUpdateOutput {
  @Input() recipe!: Recipe | RecipeInfo;
  @Input() listId!: number;
  @Output() delete = new EventEmitter<number | string | undefined>();
  @Output() update = new EventEmitter<{ listId: number | string | undefined; recipeId: number | string | undefined }>();
  @Output() details = new EventEmitter<{ listId: number | string | undefined; recipeId: number | string | undefined }>();

  onDelete() {
    this.delete.emit(this.recipe.id);
  }

  onUpdate() {
    this.update.emit({ listId: this.listId, recipeId: this.recipe.id! });
  }

  onDetails() {
    this.details.emit({ listId: this.listId, recipeId: this.recipe.id! });
  }
}

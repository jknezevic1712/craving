import { EventEmitter, Injectable } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';
@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  ingredientAdded = new EventEmitter<Ingredient>();

  private ingredients: Ingredient[] = [
    new Ingredient('Chocolate', 250),
    new Ingredient('Flour', 500),
  ];

  getIngredients() {
    return this.ingredients.slice();
  }
}

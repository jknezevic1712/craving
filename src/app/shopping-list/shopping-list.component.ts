import { Component } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent {
  ingredients: Ingredient[] = [
    new Ingredient('Chocolate', 250),
    new Ingredient('Flour', 500),
  ];

  onIngredientAdded(ingredient: Ingredient) {
    // Both ways work, not sure if there's any diff between them, second one seems faster and more easily readable
    // this.ingredients.push(new Ingredient(ingredient.name, ingredient.amount));
    this.ingredients.push(ingredient);
  }
}

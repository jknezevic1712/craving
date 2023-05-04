import { Component, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Ingredient[];

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.getIngredients();

    this.shoppingListService.ingredientAdded.subscribe(
      (ingredient: Ingredient) => {
        this.ingredients.push(ingredient);
      }
    );
  }

  // onIngredientAdded(ingredient: Ingredient) {
  // Both ways work, not sure if there's any diff between them, second one seems faster and more easily readable
  // this.ingredients.push(new Ingredient(ingredient.name, ingredient.amount));
  //   this.ingredients.push(ingredient);
  // }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';

import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      'Fudge',
      'Fudgiest experience ever!',
      'https://www.livewellbakeoften.com/wp-content/uploads/2019/08/Fudge-Recipe-36-s-copy.jpg',
      [
        new Ingredient('Chocolate', 250),
        new Ingredient('Chocolate chips', 50),
        new Ingredient('Flour', 300),
      ]
    ),
    new Recipe(
      'Ćevapi',
      'Taste Bosnia!',
      'https://st2.depositphotos.com/1004288/11083/i/950/depositphotos_110833444-stock-photo-cevapcici-bosnian-minced-meat-kebab.jpg',
      [
        new Ingredient('Minced meat with spices', 250),
        new Ingredient('Chopped onions', 75),
        new Ingredient('Lepinja bread', 1),
      ]
    ),
    new Recipe(
      'Pork knuckle',
      'Traditional German dish',
      'https://s3.envato.com/files/432114257/3349-2023_01_19-15_56_53-ISO200.jpg',
      [
        new Ingredient('Pork knuckle', 1),
        new Ingredient('Cabbage salad', 100),
        new Ingredient('Cooked potato slices', 200),
      ]
    ),
  ];

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipe(index: number) {
    return this.recipes.slice()[index];
  }

  getRecipes() {
    return this.recipes.slice();
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}

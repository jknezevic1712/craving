import { EventEmitter } from '@angular/core';

import { Recipe } from './recipe.model';

export class RecipeService {
  recipeSelected = new EventEmitter<Recipe>();

  private recipes: Recipe[] = [
    new Recipe(
      'Fudge',
      'Fudgiest experience ever!',
      'https://www.livewellbakeoften.com/wp-content/uploads/2019/08/Fudge-Recipe-36-s-copy.jpg'
    ),
    new Recipe(
      'Ćevapi',
      'Taste Bosnia!',
      'https://st2.depositphotos.com/1004288/11083/i/950/depositphotos_110833444-stock-photo-cevapcici-bosnian-minced-meat-kebab.jpg'
    ),
    new Recipe(
      'Pork knuckle',
      'Traditional German dish',
      'https://s3.envato.com/files/432114257/3349-2023_01_19-15_56_53-ISO200.jpg'
    ),
  ];

  getRecipes() {
    return this.recipes.slice();
  }
}

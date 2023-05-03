import { Component } from '@angular/core';

import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent {
  recipes: Recipe[] = [
    new Recipe(
      'Fudge',
      'Fudgiest experience ever!',
      'https://www.livewellbakeoften.com/wp-content/uploads/2019/08/Fudge-Recipe-36-s-copy.jpg'
    ),
    new Recipe(
      'Fudge',
      'Fudgiest experience ever!',
      'https://www.livewellbakeoften.com/wp-content/uploads/2019/08/Fudge-Recipe-36-s-copy.jpg'
    ),
    new Recipe(
      'Fudge',
      'Fudgiest experience ever!',
      'https://www.livewellbakeoften.com/wp-content/uploads/2019/08/Fudge-Recipe-36-s-copy.jpg'
    ),
  ];
}

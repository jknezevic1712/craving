import { Component, OnInit } from '@angular/core';

import { Ingredient } from '../shared/ingredient.model';

import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromApp from '../store/app.reducer';
import * as ShoppingListActions from './store/shopping-list.actions';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
})
export class ShoppingListComponent implements OnInit {
  ingredients: Observable<{ ingredients: Ingredient[] }>;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');
  }

  onEditItem(index: number) {
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  // oningredientsChanged(ingredient: Ingredient) {
  // Both ways work, not sure if there's any diff between them, second one seems faster and more easily readable
  // this.ingredients.push(new Ingredient(ingredient.name, ingredient.amount));
  //   this.ingredients.push(ingredient);
  // }
}

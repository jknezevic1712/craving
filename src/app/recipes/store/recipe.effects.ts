import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as fromApp from 'src/app/store/app.reducer';
import * as RecipesActions from './recipe.actions';
import { Recipe } from '../recipe.model';

@Injectable()
export class RecipeEffects {
  fetchRecipes = createEffect(() =>
    this.actions$.pipe(
      ofType(RecipesActions.FETCH_RECIPES),
      switchMap(() => {
        return this.http.get<Recipe[]>(
          'https://craving-3dd09-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
        );
      }),
      map((recipes) => {
        return recipes.map((recipe) => {
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      map((recipes) => new RecipesActions.SetRecipes(recipes))
    )
  );

  storeRecipes = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),
        switchMap(([actionData, recipesState]) => {
          return this.http.put(
            'https://craving-3dd09-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
            recipesState.recipes
          );
        })
      ),
    {
      dispatch: false,
    }
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}

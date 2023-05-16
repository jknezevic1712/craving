// ! NOT USED

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';

import { Recipe } from '../recipes/recipe.model';

import * as fromApp from '../store/app.reducer';
import * as RecipesActions from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();

    this.http
      .put(
        'https://craving-3dd09-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
      )
      .subscribe((res) => {
        console.log(res);
      });
  }

  fetchRecipes() {
    // take(1) operator means that we want to take only one value from the Observable and after that it should automatically unsub.
    // exhaustMap() works kind of like .then() with Promises, so once the user observable is done fetching the user, this.authService.user will get replaced by the inner observable we provided inside of exhaustMap()
    // Cool thing about this is that you can, as shown below, just continue adding other operators that should work with the data or whatever the inner Observable returns

    // return this.authService.user.pipe(
    //   take(1),
    //   exhaustMap((user) => {
    //     return this.http.get<Recipe[]>(
    //       'https://craving-3dd09-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    //       {
    //         params: new HttpParams().set('auth', user.token),
    //       }
    //     );
    //   }),
    //   map((recipes) => {
    //     return recipes.map((recipe) => {
    //       return {
    //         ...recipe,
    //         ingredients: recipe.ingredients ? recipe.ingredients : [],
    //       };
    //     });
    //   }),
    //   tap((fetchedRecipes) => {
    //     this.recipesService.setRecipes(fetchedRecipes);
    //   })
    // );

    return this.http
      .get<Recipe[]>(
        'https://craving-3dd09-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => {
            return {
              ...recipe,
              ingredients: recipe.ingredients ? recipe.ingredients : [],
            };
          });
        }),
        tap((fetchedRecipes) => {
          // this.recipesService.setRecipes(fetchedRecipes);
          this.store.dispatch(new RecipesActions.SetRecipes(fetchedRecipes));
        })
      );
  }
}

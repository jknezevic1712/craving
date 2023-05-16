import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
// import { RecipeService } from '../recipe.service';

import * as fromApp from 'src/app/store/app.reducer';
import { map, switchMap } from 'rxjs/operators';

import * as RecipesActions from '../store/recipe.actions';
import * as ShoppingListActions from '../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;

  constructor(
    // private recipeService: RecipeService,
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit(): void {
    // this.route.params.subscribe((params: Params) => {
    //   this.id = +params['id'];
    //   this.store
    //     .select('recipes')
    //     .pipe(
    //       map((recipesState) =>
    //         recipesState.recipes.find((recipe, index) => index === this.id)
    //       )
    //     )
    //     .subscribe((recipe) => (this.recipe = recipe));
    // });

    this.route.params
      .pipe(
        map((params) => +params['id']),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipesState) =>
          recipesState.recipes.find((recipe, index) => index === this.id)
        )
      )
      .subscribe((recipe) => (this.recipe = recipe));
  }

  onAddToShoppingList() {
    // this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
    this.store.dispatch(
      new ShoppingListActions.AddIngredients(this.recipe.ingredients)
    );
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route }); // One way, probably the way you would use it
    // this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route }); // Other way, for demo purposes
  }

  onDeleteRecipe() {
    // this.recipeService.deleteRecipe(this.id);
    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}

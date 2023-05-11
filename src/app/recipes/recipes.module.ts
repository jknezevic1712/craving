import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { RecipesRoutingModule } from './recipes-routing.module';
import { SharedModule } from '../shared/shared.module';

import { RecipesComponent } from './recipes.component';
import { RecipeListComponent } from './recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { RecipeItemComponent } from './recipe-list/recipe-item/recipe-item.component';
import { RecipeStartComponent } from './recipe-start/recipe-start.component';
import { RecipeEditComponent } from './recipe-edit/recipe-edit.component';

@NgModule({
  declarations: [
    RecipesComponent,
    RecipeListComponent,
    RecipeDetailComponent,
    RecipeItemComponent,
    RecipeStartComponent,
    RecipeEditComponent,
  ],
  imports: [RouterModule, RecipesRoutingModule, ReactiveFormsModule, SharedModule],
  /* 
  * NOTE

  There is no reason to still export all these recipe components because we're now only using them internally in the recipes module.
  We're using them either embedded into other components here, or by loading them through the recipes routing module.
  Both is part of this file.
  
  */
  // exports: [
  //   RecipesComponent,
  //   RecipeListComponent,
  //   RecipeDetailComponent,
  //   RecipeItemComponent,
  //   RecipeStartComponent,
  //   RecipeEditComponent,
  // ],
})
export class RecipesModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ShoppingEditComponent } from './shopping-edit/shopping-edit.component';
import { ShoppingListComponent } from './shopping-list.component';

import { ShoppingListRoutingModule } from './shopping-list-routing.module';

@NgModule({
  declarations: [ShoppingListComponent, ShoppingEditComponent],
  imports: [RouterModule, ShoppingListRoutingModule, CommonModule, FormsModule],
})
export class ShoppingListModule {}

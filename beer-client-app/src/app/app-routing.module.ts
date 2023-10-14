import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { FavoriteItemsComponent } from './favorite-items/favorite-items.component';

const routes: Routes = [
  { path: '', component: ItemListComponent },
  { path: 'Favorites', component: FavoriteItemsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

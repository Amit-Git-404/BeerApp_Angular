import { Component, OnInit } from '@angular/core';
import { BeerData } from '../Models/beer-model';
import { GET_FAV_ITEMS, REMOVE_FAV_ID } from '../Providers/local-storage.provider';
import { USER_ID } from '../Models/app.constants';

@Component({
  selector: 'app-favorite-items',
  templateUrl: './favorite-items.component.html',
  styleUrls: ['./favorite-items.component.css']
})
export class FavoriteItemsComponent implements OnInit {
  favoriteItems: BeerData[] = [];
  favoriteInfoText: string = "Your Favorites Items";
  ngOnInit(): void {
    this.favoriteItems = GET_FAV_ITEMS(USER_ID);
    if(this.favoriteItems.length == 0){
      this.favoriteInfoText = "No Items in your favorites yet";
    }
  }

  handleFavorites(item: BeerData) {
    let index: number = this.favoriteItems.findIndex(x => x.id == item.id);
    if (index != -1) {
      this.favoriteItems.splice(index, 1);
    }
    REMOVE_FAV_ID(item, USER_ID);
  }
}

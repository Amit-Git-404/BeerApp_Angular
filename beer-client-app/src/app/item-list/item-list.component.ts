import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BeerData, RequestParams } from '../Models/beer-model';
import { DataService } from '../data-service.service';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { USER_ID } from '../Models/app.constants';
import { GET_FAV_ITEMS, REMOVE_FAV_ID, SAVE_FAV_ID } from '../Providers/local-storage.provider';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent implements OnInit, OnDestroy {
  beerData: BeerData[] = [];
  noResultFound: boolean = false;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  searchTerm: string = '';
  showPaging: boolean = false;

  private searchTermSubject = new Subject<string>();


  constructor(private http: HttpClient, private dataService: DataService) { }

  ngOnInit(): void {
    this.searchTermSubject.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(term => {
        return this.getSearchResults(term);
      })
    ).subscribe((data) => {
      let response: BeerData[] = <BeerData[]>data;
      if (response && response.length == 0) {
        this.noResultFound = true;
      }
      this.beerData = response;
      this.markUserItemsFavorites();
    });

    this.dataService.getBeers().subscribe((data) => {
      let response: BeerData[] = <BeerData[]>data;
      this.beerData = response;
      if (this.beerData.length < this.itemsPerPage) {
        this.showPaging = false;
      }
      this.markUserItemsFavorites();
    })
  }

  ngOnDestroy(): void {
    this.beerData = [];
    this.searchTermSubject.unsubscribe();
  }

  @HostListener('document:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    this.searchTermSubject.next(this.searchTerm);
  }

  // @HostListener('document:keyup', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent): void {
  //   this.getSearchResults();
  //   return;
  //   if (event.key === 'Enter'){
  //   this.beerData = this.originalBeerData.filter(item => {
  //     if (item.name != undefined) {
  //       return item.name.toLowerCase().includes(this.searchTerm.toLowerCase())
  //     }
  //     return false;
  //   }
  //   );
  //   }
  // }

  handleFavorites(id: number) {
    let index: number = this.beerData.findIndex(x => x.id == id);
    if (index != -1) {
      let beerData: BeerData = this.beerData[index];
      if (Boolean(beerData.isFavourite)) {
        REMOVE_FAV_ID(beerData, USER_ID);
      } else {
        SAVE_FAV_ID(beerData, USER_ID);
      }
      beerData.isFavourite = !beerData.isFavourite;
    }
  }

  // getSearchResults(){
  //   let queryName = this.searchTerm != '' ? this.searchTerm : '';
  //   let reqParams: RequestParams = new RequestParams();
  //   if(queryName){
  //     reqParams.beer_name = this.searchTerm;
  //   }
  //   if(this.showPaging){
  //     reqParams.page = 1;
  //     reqParams.per_page = 10;
  //   }
  //   this.dataService.getDataWithParams(reqParams).subscribe(data => {
  //     let response: BeerData[] = <BeerData[]>data;
  //     if(response && response.length == 0){
  //       // no results
  //     }
  //     this.beerData = this.originalBeerData = response;
  //   });
  // }

  getSearchResults(term: string): Observable<any> {
    this.showPaging = true;
    let queryName = term != '' ? term : '';
    let reqParams: RequestParams = new RequestParams();
    if (queryName) {
      reqParams.beer_name = term;
    }
    reqParams.show_paging = this.showPaging;
    if (reqParams.show_paging) {
      reqParams.page = this.currentPage;
      reqParams.per_page = this.itemsPerPage;
    }
    return this.dataService.getDataWithParams(reqParams);
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getSearchResults(this.searchTerm).subscribe((data) => {
        let response: BeerData[] = <BeerData[]>data;
        if (response && response.length == 0) {
          this.noResultFound = true;
        }
        this.beerData = response;
        this.markUserItemsFavorites();
      })
    }
  }

  nextPage() {
    this.currentPage++;
    this.getSearchResults(this.searchTerm).subscribe((data) => {
      let response: BeerData[] = <BeerData[]>data;
      if (response && response.length == 0) {
        this.noResultFound = true;
      }
      this.beerData = response;
      this.markUserItemsFavorites();
    })
  }

  markUserItemsFavorites() {
    let favItems: BeerData[] = GET_FAV_ITEMS(USER_ID);
    if (favItems.length == 0) {
      return;
    }
    let favIds: number[] = favItems.map(x => x.id);
    this.beerData.forEach(x => {
      if (favIds.indexOf(x.id) != -1) {
        x.isFavourite = true;
      }
    });
  }

}

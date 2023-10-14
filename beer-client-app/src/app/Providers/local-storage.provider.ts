import { BeerData } from "../Models/beer-model";

export function GET_FAV_ITEMS(localStrKey: string): BeerData[] {
    let favItems: BeerData[] = [];
    let localResp: string = <string>localStorage.getItem(localStrKey);
    if (localResp) {
        favItems = JSON.parse(localResp);
    }
    return favItems;
}

export function SAVE_FAV_ID(favItem: BeerData, localStrKey: string) {
    let favItems: BeerData[] = GET_FAV_ITEMS(localStrKey);
    if (favItems.length > 0) {
        let index: number = favItems.findIndex(x => x.id == favItem.id);
        if (index == -1) {
            favItems.push(favItem);
        }
    } else {
        favItems = [];
        favItems.push(favItem);
    }
    let saveIdStr: string = JSON.stringify(favItems);
    localStorage.setItem(localStrKey, saveIdStr);
}

export function REMOVE_FAV_ID(favItem: BeerData, localStrKey: string) {
    let favItems: BeerData[] = GET_FAV_ITEMS(localStrKey);
    let index: number = favItems.findIndex(x => x.id == favItem.id);
    if (index != -1) {
        favItems.splice(index, 1);
        let saveIdStr: string = JSON.stringify(favItems);
        localStorage.setItem(localStrKey, saveIdStr);
    }
}

export function CLEAR_FAV_LIST(localStrKey: string) {
    localStorage.removeItem(localStrKey);
}
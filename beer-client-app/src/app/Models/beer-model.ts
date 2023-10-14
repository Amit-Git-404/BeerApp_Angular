export class BeerData {
    name: string | undefined;
    description: string | undefined;
    image_url: string | undefined;
    tagline: string | undefined;
    id: number = -1;
    isFavourite: boolean = false;
}

export class RequestParams {
    beer_name: string = "";
    page: number = 1;
    per_page: number = 10;
    show_paging: boolean = false;
}
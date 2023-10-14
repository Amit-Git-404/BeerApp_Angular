import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  getDataWithParams(params: any): Observable<any> {
    let headers = new HttpHeaders({ 'Access-Control-Allow-Origin': '*' });
    return this.http.get(`${environment.apiUrl}/GetBeers`, {params, headers: headers});
  }

  getBeers(): Observable<any>{
    return this.http.get(`${environment.apiUrl}/GetBeers`);
  }
}

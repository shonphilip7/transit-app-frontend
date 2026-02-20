import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Map {
  private apiUrl = 'http://localhost/api/kml/R1/1';

  constructor(private http: HttpClient) { }

  getCoordinates(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  };
}

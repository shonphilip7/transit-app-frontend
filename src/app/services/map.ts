import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Map {

  constructor(private http: HttpClient) { }

  getCoordinates(route: string): Observable<any[]> {
    /**
     * Using const for API URLs in Ionic/Angular functions ensures the URL 
     * remains immutable and local to that scope
     */
    const apiUrl = `http://localhost/api/kml/${route}/1`;
    return this.http.get<any[]>(apiUrl);
  };
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Trainview {
  private apiUrl = 'http://localhost/api/trainview/VYTA';
  private routeUrl = 'http://localhost/api/routes';
  
  constructor(private http: HttpClient) { }

  getTrainView(route: string, stop: string): Observable<any[]> {
    const trainViewUrl = `http://localhost/api/trainview/${route}/${stop}`;
    return this.http.get<any[]>(trainViewUrl);
  };

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(this.routeUrl);
  }
  
  getStops(route: string): Observable<any[]> {
    //using backtick to append variable
    const stopUrl = `http://localhost/api/${route}/stops`
    return this.http.get<any[]>(stopUrl);
  }
}

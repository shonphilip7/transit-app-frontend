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

  getTrainView(): Observable<any[]>{
    return this.http.get<any[]>(this.apiUrl);
  };

  getRoutes(): Observable<any[]> {
    return this.http.get<any[]>(this.routeUrl);
  }
}

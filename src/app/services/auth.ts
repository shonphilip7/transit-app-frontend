import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageServices } from './storage-services';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = 'http://localhost/api/';
  private readonly AUTH_TOKEN_KEY = 'auth_token';
  private AUTH_TOKEN_VALUE = null;

  constructor(private http: HttpClient, private storageService: StorageServices) {}

  async isLoggedIn()
  {
    this.AUTH_TOKEN_VALUE = await this.storageService.get(this.AUTH_TOKEN_KEY);
    console.log(this.AUTH_TOKEN_VALUE);
    if (this.AUTH_TOKEN_VALUE === null) {
      return false;
    } else {
      return this.AUTH_TOKEN_VALUE
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}login`, credentials);
  }

  register(credentials: any): Observable<any> {
     return this.http.post(`${this.apiUrl}register`, credentials);
  }

  logout(token: any):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer '+token
    });
    return this.http.get(`${this.apiUrl}logout`, { headers });
  }
}

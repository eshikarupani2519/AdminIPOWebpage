import { Injectable } from '@angular/core';
//bes
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
//bee
@Injectable({
  providedIn: 'root'
})
export class AuthService {
//bes
  private baseUrl = 'http://localhost:4200/api/auth';

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string }>(`${this.baseUrl}/sign-in`, { username, password })
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
      }));
  }

  // logout() {
  //   localStorage.removeItem('token');
  // }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
    // !! converts the truthy or falsy value to boolean
  }
  //bee
}

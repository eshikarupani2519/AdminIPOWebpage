import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  loggedInUser!:string;
  constructor(private http:HttpClient){
    this.loggedInUser = localStorage.getItem('IPOLoggedInUser') ?? '';
  }
  
  

  getIPOs() {
    return this.http.get(`${environment.apiUrl}/ipos`);
  }

}

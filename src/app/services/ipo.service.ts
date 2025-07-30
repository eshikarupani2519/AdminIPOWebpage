import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class IpoService {


  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompanies() {
    return this.http.get(`${this.baseUrl}/companies`);
  }
 


deleteIPO(id: number) {
  return this.http.delete(`${this.baseUrl}/ipos/${id}`);
}
updateIPO(id: string, formData: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/ipos/${id}`, formData); // THIS IS THE CORRECTED LINE
  }






getNewListedIPOs() {
  return this.http.get(`${this.baseUrl}/ipos/listed`);
}

  getAllIPOs() {
    return this.http.get(`${this.baseUrl}/ipos`);
  }

  searchIPOs(keyword: string) {
    return this.http.get(`${this.baseUrl}/ipos/search?keyword=${keyword}`);
  }

  getIPO(id: number) {

    return this.http.get(`${this.baseUrl}/ipos/${id}`);
  }

  // Admin: create, update, delete IPO
  createIPO(data: any) {
  return this.http.post(`${this.baseUrl}/ipos`, data);
}

  //be
  getStats() {
    return this.http.get(`http://localhost:5000/api/admin/stats`);
  }
}

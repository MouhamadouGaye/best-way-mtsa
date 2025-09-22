// src/app/services/api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private apiUrl = 'http://localhost:8080/api'; // Your Spring Boot backend

  constructor(private http: HttpClient) {}

  // get<T>(path: string): Observable<T> {
  //   return this.http.get<T>(`${this.apiUrl}${path}`);
  // }

  // post<T>(path: string, body: any): Observable<T> {
  //   return this.http.post<T>(`${this.apiUrl}${path}`, body);
  // }

  // put<T>(path: string, body: any): Observable<T> {
  //   return this.http.put<T>(`${this.apiUrl}${path}`, body);
  // }

  // delete<T>(path: string): Observable<T> {
  //   return this.http.delete<T>(`${this.apiUrl}${path}`);
  // }

  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`, { withCredentials: true });
  }

  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${path}`, body, {
      withCredentials: true,
    });
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`, {
      withCredentials: true,
    });
  }
}

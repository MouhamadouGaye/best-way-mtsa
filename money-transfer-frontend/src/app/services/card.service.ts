import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CardService {
  private apiUrl = '/api/cards';

  constructor(private http: HttpClient) {}

  getMyCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/me`);
  }
}

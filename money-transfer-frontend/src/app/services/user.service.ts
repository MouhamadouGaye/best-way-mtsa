import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient, private api: ApiService) {}

  attachPaymentMethod(
    userId: number,
    paymentMethodId: string
  ): Observable<any> {
    return this.api.post(`users/${userId}/payment-method`, {
      paymentMethodId,
    });
  }
}

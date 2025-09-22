import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

// export class TransferService {
//   constructor(private api: ApiService, private http: HttpClient) {}

//   createTransfer(fromUserId: number | null, toUserId: number, amount: number) {
//     return this.api.post('/transfers', { fromUserId, toUserId, amount });
//   }

//   getTransfers(userId: number | null): Observable<any[]> {
//     return this.http.get<any[]>(
//       `http://localhost:8080/api/transfers/user/${userId}`,
//       { withCredentials: true }
//     );
//   }

//   getEntry(entryId: number) {
//     return this.api.get(`/entries/${entryId}`);
//   }

//   getUserHead(userId: number) {
//     return this.api.get(`/entries/user/${userId}/head`);
//   }

//   getUserTail(userId: number) {
//     return this.api.get(`/entries/user/${userId}/tail`);
//   }

//   getUser(userId: number) {
//     return this.api.get(`/users/${userId}`);
//   }
// }

export interface CardInfo {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  constructor(private api: ApiService, private http: HttpClient) {}

  // addBeneficiary(userId: number, beneficiary: any): Observable<any> {
  //   return this.http.post(
  //     `http://localhost:8080/api/beneficiaries/user/${userId}`,
  //     beneficiary,
  //     { withCredentials: true }
  //   );
  // }

  addBeneficiary(beneficiary: any) {
    return this.api.post('/beneficiaries', beneficiary);
  }

  // ------------------------------
  // Créer un transfert (interne ou externe) avec infos carte
  // ------------------------------
  createTransfer(
    fromUserId: number,
    toUserId: number | null,
    beneficiaryId: number | null,
    amount: number | null,
    cardInfo?: CardInfo // optionnel pour test / paiement futur
  ): Observable<any> {
    const payload: any = { fromUserId, toUserId, beneficiaryId, amount };
    if (cardInfo) {
      payload.cardInfo = cardInfo;
    }
    return this.api.post('/transfers', payload);
  }

  // ------------------------------
  // Récupérer les transferts d’un utilisateur
  // ------------------------------
  getTransfers(userId: number | null): Observable<any[]> {
    return this.http.get<any[]>(
      `http://localhost:8080/api/transfers/user/${userId}`,
      { withCredentials: true }
    );
  }

  // ------------------------------
  // Récupérer les bénéficiaires d’un utilisateur
  // ------------------------------
  // getBeneficiaries(userId: number): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     `http://localhost:8080/api/beneficiaries/user/${userId}`,
  //     { withCredentials: true }
  //   );
  // } this because We do not ask the userId
  getBeneficiaries() {
    return this.api.get<any[]>('/beneficiaries');
  }

  // ------------------------------
  // Entrées de transactions
  // ------------------------------
  getEntry(entryId: number) {
    return this.api.get(`/entries/${entryId}`);
  }

  getUserHead(userId: number) {
    return this.api.get(`/entries/user/${userId}/head`);
  }

  getUserTail(userId: number) {
    return this.api.get(`/entries/user/${userId}/tail`);
  }

  getUser(userId: number) {
    return this.api.get(`/users/${userId}`);
  }
}

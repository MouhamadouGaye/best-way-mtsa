// src/api/beneficiaryService.ts
import { api } from "./clients";

export interface Beneficiary {
  id: number;
  fullName: string;
  email: string;
  accountNumber: string;
  phoneNumber: string;
  bankName: string;
  countryCode: string;
  currency?: string;
  userId?: number;
}

export const beneficiaryService = {
  getAll: (): Promise<Beneficiary[]> =>
    api.get<Beneficiary[]>("/beneficiaries"),

  getById: (id: number): Promise<Beneficiary> =>
    api.get<Beneficiary>(`/beneficiaries/${id}`),

  create: (beneficiary: Partial<Beneficiary>): Promise<Beneficiary> =>
    api.post<Beneficiary>("/beneficiaries", beneficiary),

  update: (id: number, data: Partial<Beneficiary>): Promise<Beneficiary> =>
    api.put<Beneficiary>(`/beneficiaries/${id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/beneficiaries/${id}`),
};

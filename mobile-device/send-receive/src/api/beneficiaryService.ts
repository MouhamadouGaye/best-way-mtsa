// src/api/beneficiaryService.ts
import { api } from "./clients";

// Use the same interface as your hook
export interface Beneficiary {
  id: number;
  fullName: string;
  email?: string;
  phoneNumber: string;
  countryCode?: string;
  countryName?: string;
  currency?: string;
  currencySymbol?: string;
}

export const beneficiaryService = {
  getAll: (): Promise<Beneficiary[]> =>
    api.get<Beneficiary[]>("/beneficiaries"),

  getById: (id: number): Promise<Beneficiary> =>
    api.get<Beneficiary>(`/beneficiaries/${id}`),

  create: (beneficiary: Omit<Beneficiary, "id">): Promise<Beneficiary> =>
    api.post<Beneficiary>("/beneficiaries", beneficiary),

  update: (id: number, data: Partial<Beneficiary>): Promise<Beneficiary> =>
    api.put<Beneficiary>(`/beneficiaries/${id}`, data),

  delete: (id: number): Promise<void> =>
    api.delete<void>(`/beneficiaries/${id}`),
};

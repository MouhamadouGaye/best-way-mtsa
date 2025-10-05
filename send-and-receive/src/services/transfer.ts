import { api } from './api';
import type { BeneficiaryDTO, Transfer, HistoryItem } from '@/types';

export const transferService = {
  getBeneficiaries: () => api.get<BeneficiaryDTO[]>('/beneficiaries'),

  addBeneficiary: (data: Partial<BeneficiaryDTO>) =>
    api.post<BeneficiaryDTO>('/beneficiaries', data),

  createTransfer: (data: {
    fromUserId: number;
    toUserId: number | null;
    beneficiaryId: number | null;
    amount: number;
    fromCard?: boolean;
  }) => api.post<Transfer>('/transfers', data),

  getTransfers: () => api.get<Transfer[]>('/transfers'),

  getUserHistory: (userId: number, limit: number) =>
    api.get<HistoryItem[]>(`/entries/user/${userId}/history?limit=${limit}`),

  attachPaymentMethod: (userId: number, paymentMethodId: string) =>
    api.post(`/users/${userId}/payment-method`, { paymentMethodId }),
};

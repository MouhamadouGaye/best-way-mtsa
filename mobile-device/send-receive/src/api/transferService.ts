// src/api/transferService.ts
// src/api/transferService.ts
import { api } from "./clients";

export interface TransferRequestDto {
  beneficiaryId: number;
  amount: number;
  fromCard: boolean;
  toUserId?: number; // Optional for internal transfers
}

export interface TransferResponseDto {
  id: number;
  amount: number;
  createdAt: string;
  status: string;
  fromUserId: number;
  toUserId?: number;
  beneficiaryId?: number;
  recipientName: string;
  fromCard: boolean;
}

export const transferService = {
  create: (payload: TransferRequestDto): Promise<TransferResponseDto> =>
    api.post<TransferResponseDto>("/transfers", payload),

  getAll: (): Promise<TransferResponseDto[]> =>
    api.get<TransferResponseDto[]>("/transfers"),

  getById: (id: number | null): Promise<TransferResponseDto> =>
    api.get<TransferResponseDto>(`/transfers/${id}`),
};

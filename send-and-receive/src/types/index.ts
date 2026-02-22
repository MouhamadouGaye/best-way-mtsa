export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  balance?: number;
}

export interface BeneficiaryDTO {
  id: number;
  name: string;
  accountNumber?: string;
  bankName?: string;
  phoneNumber?: string;
  userId: number;
}

export interface Transfer {
  id: number;
  fromUserId: number;
  toUserId: number | null;
  beneficiaryId: number | null;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  fromCard?: boolean;
}

export interface HistoryItem {
  id: number;
  userId: number;
  transferId: number;
  amount: number;
  type: 'sent' | 'received';
  createdAt: string;
  recipientName?: string;
  senderName?: string;
}

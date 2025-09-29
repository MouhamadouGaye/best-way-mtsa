export interface HistoryItem {
  id: number;
  userId: number;
  transferId: number;
  prevEntryId?: number | null;
  nextEntryId?: number | null;
  createdAt: string; // ISO date string
  amount: number;
  balanceAfter: number;
  status: string;
  fromUserId: number | null;
  toUserId: number | null;
}

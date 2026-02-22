export interface UserDto {
  id: number;
  name: string;
  email: string;
  password: string;
  phoneNumber: string;
  userId: string;
  hasSavedCard: boolean;
  emailVerified: boolean;
  authenticated: boolean;
  requiresVerification: boolean;
  message?: string;
  currency?: string | undefined;
  balance?: number | null;
}

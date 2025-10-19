export interface UserDto {
  id: number;
  username: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  hasSavedCard?: boolean;
  currency: string | undefined;
  balance: number | null;
}

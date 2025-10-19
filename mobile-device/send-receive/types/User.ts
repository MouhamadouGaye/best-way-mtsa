export interface User {
  id: number;
  username: string;
  email: string;
  phoneNumber: string;
  currency: string;
  country: string;
  password?: string;
  hasSavedCard?: boolean;
}
export type ScreenType =
  | "Home"
  | "Beneficiaries"
  | "AddBeneficiary"
  | "Transfer"
  | "Profile"
  | "Settings"
  | "Login"
  | "Register"
  | "Send"
  | "Receive"
  | "History";

export interface BeneficiaryDTO {
  id: number;
  fullName: string;
  prefix: string;
  phoneNumber: string;
  email?: string;
  countryCode: string;
}

export interface UserDto {
  id: number;
  username: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  hasSavedCard?: boolean;
  error?: string;
  currency?: string;
}

export interface LoginResponse {
  message?: string;
  error?: string;
  user?: UserDto;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

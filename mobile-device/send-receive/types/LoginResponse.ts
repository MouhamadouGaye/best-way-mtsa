import { UserDto } from "./UserDto";

// Update to match your backend response
export interface LoginResponse {
  message?: string;
  error?: string;
  user?: UserDto;
  token?: string;
  emailVerified?: boolean;
}

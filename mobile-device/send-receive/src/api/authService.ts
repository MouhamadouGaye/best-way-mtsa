// src/api/authService.ts
import { LoginRequest, LoginResponse } from "../../types/User";
import { UserDto } from "../../types/UserDto";
import { DummyData } from "../context/AuthContext";
import { api } from "./clients";

export const authService = {
  async register(userData: Partial<UserDto>): Promise<UserDto> {
    const response = await api.post<UserDto>("/users/register", userData);
    console.log("Register infos", userData);
    console.log("Register response", response);

    if (!response) {
      throw new Error("Registration failed: No response received");
    }
    return response;
  },

  async login(credentials: LoginRequest): Promise<any> {
    console.log("Sending login request:", credentials);
    const response = await api.post<any>("/auth/login", credentials);
    console.log("Login response received:", response);

    if (response.error) {
      throw new Error(response.error);
    }

    if (response.message === "Login successful" && response.user) {
      return {
        user: response.user,
        emailVerified: response.user.emailVerified,
      };
    }

    throw new Error(response.message || "Login failed");
  },

  async logout(data: any): Promise<void> {
    try {
      await api.post<void>("/auth/logout", data);
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async getCurrentUser(): Promise<Partial<UserDto>> {
    const response = await api.get<any>("/users/me");
    console.log("Response from users/me", response);

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response) {
      throw new Error("No user data received");
    }

    return response;
  },

  async getDummyData(): Promise<DummyData> {
    try {
      const res = await api.get<DummyData>("");
      console.log("Dummy data from HashMap", res);
      return res;
    } catch (error) {
      throw new Error("No data available from the hashMap");
    }
  },

  // ✅ EMAIL VERIFICATION (Fixed)
  async verifyEmail(token: string): Promise<any> {
    try {
      const response = await api.post<any>(
        `/users/verify-email?token=${encodeURIComponent(token)}`
      );
      console.log("Email verification response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Email verification error:", error);
      throw new Error(error.message || "Email verification failed");
    }
  },

  // ✅ ACCOUNT VERIFICATION (Fixed)
  async verifyAccount(token: string): Promise<any> {
    try {
      const response = await api.post<any>(
        `/users/verify-account?token=${encodeURIComponent(token)}`
      );
      console.log("Account verification response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Account verification error:", error);
      throw new Error(error.message || "Account verification failed");
    }
  },

  // ✅ PASSWORD RESET REQUEST (Fixed)
  async forgotPassword(email: string): Promise<any> {
    try {
      const response = await api.post<any>(
        `/users/forgot-password?email=${encodeURIComponent(email)}`
      );
      console.log("Forgot password response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Forgot password error:", error);
      throw new Error(error.message || "Password reset request failed");
    }
  },

  // ✅ PASSWORD RESET CONFIRMATION
  async resetPassword(token: string, newPassword: string): Promise<any> {
    try {
      const response = await api.post<any>("/users/reset-password", {
        token,
        newPassword,
      });
      console.log("Reset password response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Reset password error:", error);
      throw new Error(error.message || "Password reset failed");
    }
  },

  // ✅ VERIFY EMAIL CHANGE (Fixed)
  async verifyEmailChange(token: string): Promise<any> {
    try {
      const response = await api.post<any>(
        `/users/verify-email-change?token=${encodeURIComponent(token)}`
      );
      console.log("Verify email change response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Verify email change error:", error);
      throw new Error(error.message || "Email change verification failed");
    }
  },

  // ✅ RESEND VERIFICATION EMAIL (Fixed)
  async resendVerificationEmail(email: string): Promise<any> {
    try {
      const response = await api.post<any>(
        `/users/resend-verification?email=${encodeURIComponent(email)}`
      );
      console.log("Resend verification email response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Resend verification email error:", error);
      throw new Error(error.message || "Failed to resend verification email");
    }
  },

  // ... keep the other methods the same (they don't use query params)
  async updateProfile(profileData: {
    name?: string;
    phoneNumber?: string;
  }): Promise<UserDto> {
    try {
      const response = await api.put<UserDto>("/users/profile", profileData);
      console.log("Update profile response:", response);

      if (!response) {
        throw new Error("No response received");
      }
      return response;
    } catch (error: any) {
      console.error("Update profile error:", error);
      throw new Error(error.message || "Profile update failed");
    }
  },

  async changeEmail(newEmail: string, password: string): Promise<any> {
    try {
      const response = await api.put<any>("/users/email", {
        newEmail,
        password,
      });
      console.log("Change email response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Change email error:", error);
      throw new Error(error.message || "Email change request failed");
    }
  },

  async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    try {
      const response = await api.put<any>("/users/password", {
        currentPassword,
        newPassword,
      });
      console.log("Change password response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Change password error:", error);
      throw new Error(error.message || "Password change failed");
    }
  },

  async attachPaymentMethod(paymentMethodId: string): Promise<any> {
    try {
      const response = await api.post<any>("/users/payment-method", {
        paymentMethodId,
      });
      console.log("Attach payment method response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Attach payment method error:", error);
      throw new Error(error.message || "Payment method attachment failed");
    }
  },

  async removePaymentMethod(cardId: number): Promise<any> {
    try {
      const response = await api.delete<any>(`/users/payment-method/${cardId}`);
      console.log("Remove payment method response:", response);

      if (response.error) {
        throw new Error(response.error);
      }
      return response;
    } catch (error: any) {
      console.error("Remove payment method error:", error);
      throw new Error(error.message || "Payment method removal failed");
    }
  },
};

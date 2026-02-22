// src/api/paymentService.ts
import { api } from "./clients";

export interface SetupIntentResponse {
  clientSecret: string;
  customerId: string;
}

export interface PaymentMethod {
  id: string;
  card: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
}

export const paymentService = {
  // Create a Setup Intent to attach payment method to customer
  async createSetupIntent(): Promise<SetupIntentResponse> {
    return api.post<SetupIntentResponse>("/payments/setup-intent");
  },

  // Confirm the setup intent with payment method
  async confirmSetupIntent(
    setupIntentId: string,
    paymentMethodId: string
  ): Promise<void> {
    return api.post<void>("/payments/confirm-setup", {
      setupIntentId,
      paymentMethodId,
    });
  },

  // Get user's payment methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return api.get<PaymentMethod[]>("/payments/methods");
  },

  // Set default payment method
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<void> {
    return api.post<void>("/payments/default-method", { paymentMethodId });
  },

  // Detach payment method
  async detachPaymentMethod(paymentMethodId: string): Promise<void> {
    return api.delete<void>(`/payments/methods/${paymentMethodId}`);
  },
};

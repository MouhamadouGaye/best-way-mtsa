export interface BeneficiaryDTO {
  id: number;
  fullName: string;
  prefix: string;
  phoneNumber: string;
  email?: string;
  countryCode: string;
}

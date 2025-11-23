export interface TaxInfo {
  taxId: string;
  name: string;
  type: string;
  representative?: string;
  address?: string;
  status?: string;

  // với cá nhân
  dateOfBirth?: string;

  // với doanh nghiệp
  foundingDate?: string;
}

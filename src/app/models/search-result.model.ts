import { TaxInfo } from './tax-info.model';

export interface SearchResult {
  success: boolean;
  data?: TaxInfo | null;
  message?: string;
}

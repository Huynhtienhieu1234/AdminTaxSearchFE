export interface Personal {
  input: string;
  timestamp: string;
  found: boolean;
  detail_url?: string;
  data?: {
    name?: string;
    tax_id?: string;
    status?: string;
    representative?: string;
    start_date?: string;
    manager?: string;
    address?: string;
  };
  note?: string;
  error?: string;
}

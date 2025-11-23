export interface Apikey {
  apikeyId: number;
  systemName: string;
  apikey: string;
  description?: string;
  isActive?: boolean;
  issuedDate?: string;
  userId?: number;
}

export interface CreateApikeyRequest {
  systemName: string;
  description?: string;
}

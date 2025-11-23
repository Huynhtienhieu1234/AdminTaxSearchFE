export interface WardMapping {
  id: number;
  oldWardCode?: string;
  oldWardName?: string;
  oldDistrictName?: string;
  oldProvinceName?: string;
  newWardCode?: string;
  newWardName?: string;
  newProvinceName?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

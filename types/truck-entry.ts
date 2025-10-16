export interface TruckEntry {
  id: string;
  truckNumber: string;
  driverName: string;
  driverPhone?: string | null;
  traderId: string;
  arrivalTime: Date | string;
  securityOfficerId: string;
  notes?: string | null;
  createdAt: Date | string;
  // Relations
  trader?: {
    id: string;
    name: string;
  };
  securityOfficer?: {
    id: string;
    name: string;
  };
}

export interface TruckEntryCreateDTO {
  truckNumber: string;
  driverName: string;
  driverPhone?: string;
  traderId: string;
  securityOfficerId: string;
  notes?: string;
}

export interface TruckEntryListResponse {
  entries: TruckEntry[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface Trader {
  id: string;
  name: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

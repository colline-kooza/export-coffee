export interface WeighbridgeReading {
  id: string;
  entryId: string;
  entry: {
    id: string;
    truckNumber: string;
    driverName: string;
    driverPhone?: string;
    arrivalTime: string;
    securityOfficer?: {
      id: string;
      name: string;
      email: string;
    };
  };
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  operatorId: string;
  operator: {
    id: string;
    name: string;
    email: string;
  };
  timestamp: string;
  notes?: string;
  hasBWN?: boolean;
  buyingWeightNote?: {
    id: string;
    bwnNumber: string;
    status: string;
  };
}

export interface WeighbridgeReadingCreateDTO {
  entryId: string;
  grossWeightKg: number;
  tareWeightKg: number;
  operatorId: string;
  notes?: string;
}

export interface PendingTruckEntry {
  id: string;
  truckNumber: string;
  driverName: string;
  driverPhone?: string;
  arrivalTime: string;
  traderId: string;
  trader?: {
    id: string;
    name: string;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

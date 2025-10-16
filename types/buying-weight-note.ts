export enum BWNStatus {
  PENDING_WEIGHING = "PENDING_WEIGHING",
  WEIGHED = "WEIGHED",
  MOISTURE_TESTED = "MOISTURE_TESTED",
  PRICE_CALCULATED = "PRICE_CALCULATED",
  AWAITING_QC = "AWAITING_QC",
  PAYMENT_APPROVED = "PAYMENT_APPROVED",
  COMPLETED = "COMPLETED",
  REJECTED = "REJECTED",
}

export enum CoffeeType {
  ARABICA = "ARABICA",
  ROBUSTA = "ROBUSTA",
}

export interface BuyingWeightNote {
  id: string;
  bwnNumber: string;
  traderId: string;
  trader: {
    id: string;
    name: string;
    traderCode: string;
    phoneNumber: string;
  };
  weighbridgeReadingId: string;
  weighbridgeReading: {
    id: string;
    grossWeightKg: number;
    tareWeightKg: number;
    netWeightKg: number;
    timestamp: string;
    entry: {
      truckNumber: string;
      driverName: string;
    };
  };
  deliveryDate: string;
  truckNumber: string;
  coffeeType: CoffeeType;
  grossWeightKg: number;
  tareWeightKg: number;
  netWeightKg: number;
  moistureContent: number;
  moistureDeductionKg: number;
  finalNetWeightKg: number;
  pricePerKgUGX: number;
  totalAmountUGX: string; // Changed from number to string to handle BigInt
  outturn?: string;
  qualityAnalysisNo?: string;
  buyingCentre?: string;
  status: BWNStatus;
  paymentStatus: string;
  createdById: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
  };
  approvedById?: string;
  approvedBy?: {
    id: string;
    name: string;
    email: string;
  };
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BuyingWeightNoteCreateDTO {
  weighbridgeReadingId: string;
  coffeeType: CoffeeType;
  moistureContent: number;
  pricePerKgUGX: number;
  outturn?: string;
  qualityAnalysisNo?: string;
  buyingCentre?: string;
}

export interface BuyingWeightNoteUpdateDTO {
  coffeeType?: CoffeeType;
  moistureContent?: number;
  pricePerKgUGX?: number;
  outturn?: string;
  qualityAnalysisNo?: string;
  buyingCentre?: string;
  status?: BWNStatus;
  paymentStatus?: string;
}

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
}

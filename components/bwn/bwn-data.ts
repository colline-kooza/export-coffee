// Mock data store for BWN operations
// In production, this would be replaced with database calls

export interface BuyingWeightNote {
  id: string;
  bwnNumber: string;
  traderId: string;
  traderName: string;
  coffeeType: string;
  quantity: number; // in kg
  unitPrice: number; // in UGX
  totalValue: number; // in UGX
  moistureContent: number; // percentage
  qualityGrade: string;
  status: "pending" | "approved" | "rejected" | "paid";
  createdDate: string;
  approvedDate?: string;
  notes: string;
  paymentStatus: "unpaid" | "partial" | "paid";
  paidAmount?: number;
}

// Mock database
const bwnDatabase: BuyingWeightNote[] = [
  {
    id: "1",
    bwnNumber: "BWN-2025-001",
    traderId: "T001",
    traderName: "Kampala Coffee Traders",
    coffeeType: "Arabica",
    quantity: 5000,
    unitPrice: 3500,
    totalValue: 17500000,
    moistureContent: 11.5,
    qualityGrade: "A",
    status: "approved",
    createdDate: "2025-01-10",
    approvedDate: "2025-01-11",
    notes: "High quality beans from Rwenzori region",
    paymentStatus: "paid",
    paidAmount: 17500000,
  },
  {
    id: "2",
    bwnNumber: "BWN-2025-002",
    traderId: "T002",
    traderName: "Mbarara Coffee Cooperative",
    coffeeType: "Robusta",
    quantity: 3000,
    unitPrice: 2800,
    totalValue: 8400000,
    moistureContent: 12.0,
    qualityGrade: "B",
    status: "pending",
    createdDate: "2025-01-15",
    notes: "Awaiting quality inspection",
    paymentStatus: "unpaid",
  },
  {
    id: "3",
    bwnNumber: "BWN-2025-003",
    traderId: "T003",
    traderName: "Fort Portal Exporters",
    coffeeType: "Arabica",
    quantity: 7500,
    unitPrice: 3800,
    totalValue: 28500000,
    moistureContent: 10.8,
    qualityGrade: "A+",
    status: "approved",
    createdDate: "2025-01-12",
    approvedDate: "2025-01-13",
    notes: "Premium quality, ready for export",
    paymentStatus: "partial",
    paidAmount: 14250000,
  },
];

export async function getAllBWN(): Promise<BuyingWeightNote[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...bwnDatabase]), 100);
  });
}

export async function getBWNById(id: string): Promise<BuyingWeightNote | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const bwn = bwnDatabase.find((b) => b.id === id);
      resolve(bwn || null);
    }, 100);
  });
}

export async function createBWN(
  data: Omit<BuyingWeightNote, "id" | "status" | "createdDate">
): Promise<BuyingWeightNote> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newBWN: BuyingWeightNote = {
        ...data,
        id: String(bwnDatabase.length + 1),
        status: "pending",
        createdDate: new Date().toISOString().split("T")[0],
      };
      bwnDatabase.push(newBWN);
      resolve(newBWN);
    }, 100);
  });
}

export async function updateBWN(
  id: string,
  data: Partial<BuyingWeightNote>
): Promise<BuyingWeightNote | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = bwnDatabase.findIndex((b) => b.id === id);
      if (index === -1) {
        resolve(null);
        return;
      }
      bwnDatabase[index] = { ...bwnDatabase[index], ...data };
      resolve(bwnDatabase[index]);
    }, 100);
  });
}

export async function deleteBWN(id: string): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = bwnDatabase.findIndex((b) => b.id === id);
      if (index === -1) {
        resolve(false);
        return;
      }
      bwnDatabase.splice(index, 1);
      resolve(true);
    }, 100);
  });
}

export async function approveBWN(id: string): Promise<BuyingWeightNote | null> {
  return updateBWN(id, {
    status: "approved",
    approvedDate: new Date().toISOString().split("T")[0],
  });
}

export async function rejectBWN(id: string): Promise<BuyingWeightNote | null> {
  return updateBWN(id, { status: "rejected" });
}

export async function recordPayment(
  id: string,
  amount: number
): Promise<BuyingWeightNote | null> {
  const bwn = await getBWNById(id);
  if (!bwn) return null;

  const newPaidAmount = (bwn.paidAmount || 0) + amount;
  const paymentStatus = newPaidAmount >= bwn.totalValue ? "paid" : "partial";

  return updateBWN(id, {
    paidAmount: newPaidAmount,
    paymentStatus,
    status: paymentStatus === "paid" ? "paid" : bwn.status,
  });
}

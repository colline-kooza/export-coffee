<<<<<<< HEAD
import db from "./db";

export const dummyTraders = [
  {
    name: "Ahmed Coffee Traders",
    contactPerson: "Ahmed Hassan",
    phoneNumber: "+256700123456",
    alternatePhone: "+256750123456",
    email: "ahmed@coffetraders.com",
    physicalAddress: "Plot 45, Kampala Road",
    district: "Kampala",
    registrationNumber: "BRN-2023-001234",
    tinNumber: "TIN-1001234567",
    status: "ACTIVE" as const,
    trustScore: 85,
    reliabilityScore: 90,
    totalDeliveries: 24,
    totalVolumeKg: 48000,
    qualityAcceptanceRate: 92,
    preferredPaymentDays: 1,
    notes: "Reliable trader, consistently delivers high-quality Arabica coffee",
    performance: {
      totalDeliveries: 24,
      totalVolumeKg: 48000,
      acceptedDeliveries: 22,
      rejectedDeliveries: 1,
      borderlineDeliveries: 1,
      qualityConsistencyScore: 88,
      averageDefectCount: 15,
      averageMoistureContent: 118,
      onTimeDeliveryRate: 95,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "BANK_TRANSFER",
      bankName: "Stanbic Bank",
      accountNumber: "9030012345678",
      accountName: "Ahmed Coffee Traders Ltd",
      requiresAdvance: false,
    },
  },
  {
    name: "Mbale Highland Farmers",
    contactPerson: "Sarah Nambozo",
    phoneNumber: "+256750987654",
    alternatePhone: "+256700987654",
    email: "sarah@mbalehighland.com",
    physicalAddress: "Mbale Town, Eastern Region",
    district: "Mbale",
    registrationNumber: "BRN-2022-005678",
    tinNumber: "TIN-1005678901",
    status: "ACTIVE" as const,
    trustScore: 92,
    reliabilityScore: 95,
    totalDeliveries: 36,
    totalVolumeKg: 72000,
    qualityAcceptanceRate: 97,
    preferredPaymentDays: 1,
    notes: "Top-quality Arabica from Mount Elgon region",
    performance: {
      totalDeliveries: 36,
      totalVolumeKg: 72000,
      acceptedDeliveries: 35,
      rejectedDeliveries: 0,
      borderlineDeliveries: 1,
      qualityConsistencyScore: 95,
      averageDefectCount: 8,
      averageMoistureContent: 115,
      onTimeDeliveryRate: 98,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "BANK_TRANSFER",
      bankName: "Centenary Bank",
      accountNumber: "3100567890123",
      accountName: "Mbale Highland Farmers Cooperative",
      requiresAdvance: false,
    },
  },
  {
    name: "Busoga Robusta Co-op",
    contactPerson: "James Mukasa",
    phoneNumber: "+256782345678",
    alternatePhone: "+256772345678",
    email: "james@busogacoffee.ug",
    physicalAddress: "Jinja Road, Busoga Region",
    district: "Jinja",
    registrationNumber: "BRN-2021-009876",
    tinNumber: "TIN-1009876543",
    status: "ACTIVE" as const,
    trustScore: 78,
    reliabilityScore: 82,
    totalDeliveries: 18,
    totalVolumeKg: 54000,
    qualityAcceptanceRate: 85,
    preferredPaymentDays: 1,
    notes: "Large volume supplier of Robusta coffee",
    performance: {
      totalDeliveries: 18,
      totalVolumeKg: 54000,
      acceptedDeliveries: 15,
      rejectedDeliveries: 2,
      borderlineDeliveries: 1,
      qualityConsistencyScore: 80,
      averageDefectCount: 25,
      averageMoistureContent: 122,
      onTimeDeliveryRate: 88,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "MOBILE_MONEY",
      mobileMoneyNumber: "+256782345678",
      mobileMoneyName: "James Mukasa",
      requiresAdvance: false,
    },
  },
  {
    name: "Kasese Mountain Coffee",
    contactPerson: "Grace Birungi",
    phoneNumber: "+256701234567",
    email: "grace@kasesemc.com",
    physicalAddress: "Kasese Town, Rwenzori Region",
    district: "Kasese",
    registrationNumber: "BRN-2023-002345",
    tinNumber: "TIN-1002345678",
    status: "ACTIVE" as const,
    trustScore: 88,
    reliabilityScore: 87,
    totalDeliveries: 15,
    totalVolumeKg: 30000,
    qualityAcceptanceRate: 93,
    preferredPaymentDays: 1,
    notes: "Specialty Arabica from Rwenzori mountains",
    performance: {
      totalDeliveries: 15,
      totalVolumeKg: 30000,
      acceptedDeliveries: 14,
      rejectedDeliveries: 0,
      borderlineDeliveries: 1,
      qualityConsistencyScore: 91,
      averageDefectCount: 12,
      averageMoistureContent: 117,
      onTimeDeliveryRate: 93,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "BANK_TRANSFER",
      bankName: "DFCU Bank",
      accountNumber: "2200345678901",
      accountName: "Kasese Mountain Coffee Ltd",
      requiresAdvance: false,
    },
  },
  {
    name: "Masaka Central Traders",
    contactPerson: "Peter Ssemakula",
    phoneNumber: "+256755678901",
    alternatePhone: "+256705678901",
    email: "peter@masakacoffee.com",
    physicalAddress: "Masaka Town Center",
    district: "Masaka",
    registrationNumber: "BRN-2022-007890",
    tinNumber: "TIN-1007890123",
    status: "UNDER_REVIEW" as const,
    trustScore: 65,
    reliabilityScore: 70,
    totalDeliveries: 8,
    totalVolumeKg: 16000,
    qualityAcceptanceRate: 75,
    preferredPaymentDays: 1,
    notes: "Under review due to recent quality inconsistencies",
    performance: {
      totalDeliveries: 8,
      totalVolumeKg: 16000,
      acceptedDeliveries: 6,
      rejectedDeliveries: 1,
      borderlineDeliveries: 1,
      qualityConsistencyScore: 72,
      averageDefectCount: 35,
      averageMoistureContent: 128,
      onTimeDeliveryRate: 75,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "BANK_TRANSFER",
      bankName: "Bank of Africa",
      accountNumber: "4400678901234",
      accountName: "Masaka Central Traders",
      requiresAdvance: false,
    },
  },
  {
    name: "Mbarara Premium Coffee",
    contactPerson: "David Tumwebaze",
    phoneNumber: "+256774567890",
    email: "david@mbaracoffee.ug",
    physicalAddress: "Mbarara Municipality",
    district: "Mbarara",
    status: "SUSPENDED" as const,
    trustScore: 45,
    reliabilityScore: 50,
    totalDeliveries: 5,
    totalVolumeKg: 10000,
    qualityAcceptanceRate: 60,
    preferredPaymentDays: 1,
    notes: "Suspended due to payment disputes",
    performance: {
      totalDeliveries: 5,
      totalVolumeKg: 10000,
      acceptedDeliveries: 3,
      rejectedDeliveries: 2,
      borderlineDeliveries: 0,
      qualityConsistencyScore: 58,
      averageDefectCount: 45,
      averageMoistureContent: 135,
      onTimeDeliveryRate: 60,
    },
    paymentTerms: {
      paymentDays: 1,
      preferredMethod: "MOBILE_MONEY",
      mobileMoneyNumber: "+256774567890",
      mobileMoneyName: "David Tumwebaze",
      requiresAdvance: false,
    },
  },
];

async function cleanDatabase() {
  console.log("Cleaning existing trader data...");
  try {
    await db.$transaction(async (tx) => {
      await tx.traderPaymentTerms.deleteMany();
      await tx.traderPerformance.deleteMany();
      await tx.trader.deleteMany();
    });
    console.log("Trader data cleanup completed!");
  } catch (err) {
    console.error("Error cleaning trader data:", err);
    throw err;
  }
}

async function seedTraders() {
  console.log("Seeding traders...");

  for (const traderData of dummyTraders) {
    const { performance, paymentTerms, ...traderInfo } = traderData;

    // Generate trader code
    const count = await db.trader.count();
    const traderCode = `TRD-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;

    const trader = await db.trader.create({
      data: {
        ...traderInfo,
        traderCode,
        performance: performance ? { create: performance } : undefined,
        paymentTerms: paymentTerms ? { create: paymentTerms } : undefined,
      },
    });

    console.log(`Created trader: ${trader.name} (${trader.traderCode})`);
  }

  console.log("All traders seeded successfully!");
}

async function main() {
  try {
    await cleanDatabase();
    await seedTraders();
    console.log("Trader database seeding completed!");
  } catch (err) {
    console.error("Error seeding traders:", err);
    throw err;
  } finally {
    await db.$disconnect();
  }
}

main().catch((err) => {
  console.error("Seed script failed:", err);
  process.exit(1);
});
=======
import { UserRole } from "@prisma/client";
import { hashSync } from "bcrypt-ts";
import db from "./db";

async function main() {
  console.log("--Starting the seeding--");
  console.log("Deleting existing users----");
  await db.user.deleteMany({});
  console.log("✅Successfully deleted the users");
  const users = [
    {
      firstName: "James",
      lastName: "Mugisha",
      email: "james@gmail.com",
      plainPassword: "12345678",
      role: "SYSTEM_ADMIN",
      phone: "+256700000001",
    },
    {
      firstName: "Grace",
      lastName: "Nanyonga",
      email: "grace@gmail.com",
      plainPassword: "12345678",
      role: "PROCUREMENT_QUALITY_MANAGER",
      phone: "+256700000002",
    },
    {
      firstName: "Robert",
      lastName: "Ssemanda",
      email: "robert@gmail.com",
      plainPassword: "12345678",
      role: "WAREHOUSE_INVENTORY_OFFICER",
      phone: "+256700000003",
    },
    {
      firstName: "Patricia",
      lastName: "Tumusiime",
      email: "patricia@gmail.com",
      plainPassword: "12345678",
      role: "SALES_LOGISTICS_MANAGER",
      phone: "+256700000004",
    },
    {
      firstName: "David",
      lastName: "Okello",
      email: "david@gmail.com",
      plainPassword: "12345678",
      role: "FINANCE_OFFICER",
      phone: "+256700000005",
    },
    {
      firstName: "Sarah",
      lastName: "Namatovu",
      email: "sarah@gmail.com",
      plainPassword: "12345678",
      role: "OPERATIONS_MANAGER",
      phone: "+256700000006",
    },
  ];

  console.log("Creating new users----");

  for (const user of users) {
    const hashedPassword = hashSync(user.plainPassword, 10);
    const name = `${user.firstName} ${user.lastName}`;

    await db.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        email: user.email,
        password: hashedPassword,
        name: name,
        role: user.role as UserRole,
        phoneNumber: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  }

  console.log("✅ Seeded all users successfully with unique passwords!");
}

main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
>>>>>>> 6136fe927f6783db3524cf7e59dc93b0c90f97d6

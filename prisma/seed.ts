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

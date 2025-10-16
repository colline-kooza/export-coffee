import { UserRole } from "@prisma/client";
import db from "./db";
import { getRolePermissions, ROLES_PERMISSIONS } from "../lib/permissions";
import { auth } from "../lib/auth";

interface UserSeedData {
  firstName: string;
  lastName: string;
  email: string;
  plainPassword: string;
  role: UserRole;
  phone: string;
}

async function main() {
  console.log("--Starting the seeding--");

  // Delete existing data in correct order
  console.log("Cleaning up existing data...");
  await db.permission.deleteMany({});
  await db.account.deleteMany({});
  await db.session.deleteMany({});
  await db.user.deleteMany({});
  console.log("✅ Cleanup completed");

  const users: UserSeedData[] = [
    {
      firstName: "Kooza",
      lastName: "Collinz",
      email: "koozacollinz1@gmail.com",
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

  console.log("Creating users with Better Auth...");

  for (const userData of users) {
    try {
      const name = `${userData.firstName} ${userData.lastName}`;

      console.log(`Creating user: ${userData.email}`);

      // Use Better Auth API to create user properly
      // This ensures password is hashed correctly and Account record is created
      const result = await auth.api.signUpEmail({
        body: {
          email: userData.email,
          password: userData.plainPassword,
          name: name,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
        },
      });

      // Get the created user
      const user = await db.user.findUnique({
        where: { email: userData.email },
      });

      if (!user) {
        throw new Error(`User not found after creation: ${userData.email}`);
      }

      // Update user role (Better Auth creates with default role)
      await db.user.update({
        where: { id: user.id },
        data: {
          role: userData.role,
          isActive: true,
        },
      });

      // Get permissions for this role
      const rolePermissions = getRolePermissions(
        userData.role as keyof typeof ROLES_PERMISSIONS
      );

      // Delete existing permissions for this user
      await db.permission.deleteMany({
        where: { userId: user.id },
      });

      // Create permission entries for each permission
      for (const permission of rolePermissions) {
        // Extract module and action from permission string
        const [module, action] = permission.split(".");

        // Map action string to PermissionAction enum
        let permissionAction: string;
        switch (action.toUpperCase()) {
          case "CREATE":
            permissionAction = "CREATE";
            break;
          case "VIEW":
            permissionAction = "READ";
            break;
          case "UPDATE":
            permissionAction = "UPDATE";
            break;
          case "DELETE":
            permissionAction = "DELETE";
            break;
          case "APPROVE":
            permissionAction = "APPROVE";
            break;
          case "REJECT":
            permissionAction = "REJECT";
            break;
          case "EXPORT":
            permissionAction = "EXPORT";
            break;
          default:
            permissionAction = "READ";
        }

        try {
          await db.permission.create({
            data: {
              userId: user.id,
              module: module.toUpperCase(),
              action: permissionAction as any,
            },
          });
        } catch (error: any) {
          // Skip duplicate permissions (unique constraint)
          if (error.code !== "P2002") {
            throw error;
          }
        }
      }

      console.log(
        `✅ Created ${userData.firstName} ${userData.lastName} with ${rolePermissions.length} permissions`
      );
    } catch (error: any) {
      console.error(`❌ Error creating user ${userData.email}:`, error);
      // If user already exists, try to update
      if (error.status === "UNPROCESSABLE_ENTITY") {
        console.log(`User ${userData.email} already exists, updating...`);
        const user = await db.user.findUnique({
          where: { email: userData.email },
        });

        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              role: userData.role,
              isActive: true,
              firstName: userData.firstName,
              lastName: userData.lastName,
              phone: userData.phone,
            },
          });
          console.log(`✅ Updated ${userData.email}`);
        }
      } else {
        throw error;
      }
    }
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .then(async () => {
    await db.$disconnect();
    console.log("Database connection closed");
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await db.$disconnect();
    process.exit(1);
  });

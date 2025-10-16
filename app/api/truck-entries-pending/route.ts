// File 2: app/api/truck-entries-pending/route.ts
import db from "@/prisma/db";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Get truck entries that don't have weighbridge readings yet
    const entries = await db.truckEntry.findMany({
      where: {
        weighbridgeReading: null,
      },
      select: {
        id: true,
        truckNumber: true,
        driverName: true,
        driverPhone: true,
        arrivalTime: true,
        traderId: true,
        securityOfficer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        arrivalTime: "desc",
      },
      take: 100, // Limit to prevent huge lists
    });

    return Response.json(
      {
        entries,
        success: true,
        total: entries.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching pending truck entries:", error);
    return Response.json(
      {
        error: "Failed to fetch pending truck entries",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

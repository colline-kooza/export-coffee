import db from "@/prisma/db";
import type { NextRequest } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id) {
      return Response.json(
        { error: "Reading ID is required", success: false },
        { status: 400 }
      );
    }

    const reading = await db.weighbridgeReading.findUnique({
      where: { id },
      include: {
        entry: {
          include: {
            securityOfficer: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        operator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        buyingWeightNote: {
          select: {
            id: true,
            bwnNumber: true,
            status: true,
          },
        },
      },
    });

    if (!reading) {
      return Response.json(
        { error: "Weighbridge reading not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        reading,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching weighbridge reading:", error);
    return Response.json(
      {
        error: "Failed to fetch weighbridge reading",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

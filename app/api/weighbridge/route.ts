
// File: app/api/weighbridge-readings/route.ts
import db from "@/prisma/db";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("am riuning.....");
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return Response.json(
        { error: "Invalid pagination parameters", success: false },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            {
              entry: {
                truckNumber: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              entry: {
                driverName: { contains: search, mode: "insensitive" as const },
              },
            },
            {
              operator: {
                name: { contains: search, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {};

    // Get total count for pagination
    const totalCount = await db.weighbridgeReading.count({
      where: whereClause,
    });

    // Fetch readings with relations
    const readings = await db.weighbridgeReading.findMany({
      where: whereClause,
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
      orderBy: {
        timestamp: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return Response.json(
      {
        readings,
        totalCount,
        currentPage: page,
        totalPages,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching weighbridge readings:", error);
    return Response.json(
      {
        error: "Failed to fetch weighbridge readings",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { entryId, grossWeightKg, tareWeightKg, operatorId, notes } = body;

    // Validate required fields
    if (
      !entryId ||
      grossWeightKg === undefined ||
      tareWeightKg === undefined ||
      !operatorId
    ) {
      return Response.json(
        {
          error:
            "Missing required fields: entryId, grossWeightKg, tareWeightKg, operatorId",
          success: false,
        },
        { status: 400 }
      );
    }

    // Convert to numbers
    const grossWeight = Number(grossWeightKg);
    const tareWeight = Number(tareWeightKg);

    // Validate weights are valid numbers
    if (isNaN(grossWeight) || isNaN(tareWeight)) {
      return Response.json(
        { error: "Weights must be valid numbers", success: false },
        { status: 400 }
      );
    }

    // Validate weights are positive
    if (grossWeight <= 0 || tareWeight <= 0) {
      return Response.json(
        { error: "Weights must be positive numbers", success: false },
        { status: 400 }
      );
    }

    // Validate gross > tare
    if (grossWeight <= tareWeight) {
      return Response.json(
        {
          error: "Gross weight must be greater than tare weight",
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify truck entry exists
    const entryExists = await db.truckEntry.findUnique({
      where: { id: entryId },
    });

    if (!entryExists) {
      return Response.json(
        { error: "Truck entry not found", success: false },
        { status: 404 }
      );
    }

    // Check if weighbridge reading already exists for this entry
    const existingReading = await db.weighbridgeReading.findUnique({
      where: { entryId },
    });

    if (existingReading) {
      return Response.json(
        {
          error: "Weighbridge reading already exists for this truck entry",
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify operator exists
    const operatorExists = await db.user.findUnique({
      where: { id: operatorId },
    });

    if (!operatorExists) {
      return Response.json(
        { error: "Operator not found", success: false },
        { status: 404 }
      );
    }

    // Calculate net weight
    const netWeight = grossWeight - tareWeight;

    // Create weighbridge reading
    const reading = await db.weighbridgeReading.create({
      data: {
        entryId,
        grossWeightKg: grossWeight,
        tareWeightKg: tareWeight,
        netWeightKg: netWeight,
        operatorId,
        notes: notes || null,
        timestamp: new Date(),
      },
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

    return Response.json(
      {
        reading,
        success: true,
        message: "Weighbridge reading created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating weighbridge reading:", error);
    return Response.json(
      {
        error: "Failed to create weighbridge reading",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

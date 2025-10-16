// app/api/truck-entries/route.ts
import db from "@/prisma/db";
import type { NextRequest } from "next/server";

// GET - List all truck entries with pagination
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            { truckNumber: { contains: search, mode: "insensitive" as const } },
            { driverName: { contains: search, mode: "insensitive" as const } },
            { driverPhone: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {};

    // Get total count for pagination
    const totalCount = await db.truckEntry.count({
      where: whereClause,
    });

    // Fetch entries with relations
    const entries = await db.truckEntry.findMany({
      where: whereClause,
      include: {
        securityOfficer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        weighbridgeReading: true,
      },
      orderBy: {
        arrivalTime: "desc",
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return Response.json({
      entries,
      totalCount,
      currentPage: page,
      totalPages,
      success: true,
    });
  } catch (error) {
    console.error("Error fetching truck entries:", error);
    return Response.json(
      { error: "Failed to fetch truck entries", success: false },
      { status: 500 }
    );
  }
}

// POST - Create new truck entry
export async function POST(req: NextRequest) {
  console.log("am runing.......");
  try {
    const body = await req.json();
    const {
      truckNumber,
      driverName,
      driverPhone,
      traderId,
      securityOfficerId,
      notes,
    } = body;

    // Validate required fields
    if (!truckNumber || !driverName || !traderId || !securityOfficerId) {
      return Response.json(
        { error: "Missing required fields", success: false },
        { status: 400 }
      );
    }

    // Verify trader exists
    const traderExists = await db.trader.findUnique({
      where: { id: traderId },
    });

    if (!traderExists) {
      return Response.json(
        { error: "Trader not found", success: false },
        { status: 404 }
      );
    }

    // Verify security officer exists
    const officerExists = await db.user.findUnique({
      where: { id: securityOfficerId },
    });

    if (!officerExists) {
      return Response.json(
        { error: "Security officer not found", success: false },
        { status: 404 }
      );
    }

    // Create truck entry
    const entry = await db.truckEntry.create({
      data: {
        truckNumber,
        driverName,
        driverPhone: driverPhone || null,
        traderId,
        securityOfficerId,
        notes: notes || null,
        arrivalTime: new Date(),
      },
      include: {
        securityOfficer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return Response.json(
      {
        entry,
        success: true,
        message: "Truck entry created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating truck entry:", error);
    return Response.json(
      { error: "Failed to create truck entry", success: false },
      { status: 500 }
    );
  }
}

import { auth } from "@/lib/auth";
import db from "@/prisma/db";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";

// Helper function to convert BigInt to string for JSON serialization
function serializeBWN(bwn: any) {
  return {
    ...bwn,
    totalAmountUGX: bwn.totalAmountUGX.toString(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";
    const coffeeType = searchParams.get("coffeeType") || "";
    const paymentStatus = searchParams.get("paymentStatus") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { bwnNumber: { contains: search, mode: "insensitive" } },
        { truckNumber: { contains: search, mode: "insensitive" } },
        { trader: { name: { contains: search, mode: "insensitive" } } },
      ];
    }

    if (status && status !== "all") {
      where.status = status;
    }

    if (coffeeType && coffeeType !== "all") {
      where.coffeeType = coffeeType;
    }

    if (paymentStatus && paymentStatus !== "all") {
      where.paymentStatus = paymentStatus;
    }

    const [bwns, totalCount] = await Promise.all([
      db.buyingWeightNote.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          trader: {
            select: {
              id: true,
              name: true,
              traderCode: true,
              phoneNumber: true,
            },
          },
          weighbridgeReading: {
            include: {
              entry: {
                select: {
                  truckNumber: true,
                  driverName: true,
                },
              },
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          approvedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      db.buyingWeightNote.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Serialize BigInt values
    const serializedBwns = bwns.map(serializeBWN);

    return Response.json(
      {
        bwns: serializedBwns,
        success: true,
        totalCount,
        currentPage: page,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buying weight notes:", error);
    return Response.json(
      {
        error: "Failed to fetch buying weight notes",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return Response.json(
        { error: "Unauthorized - Please login", success: false },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      weighbridgeReadingId,
      coffeeType,
      moistureContent,
      pricePerKgUGX,
      outturn,
      qualityAnalysisNo,
      buyingCentre,
    } = body;

    // Comprehensive validation
    if (!weighbridgeReadingId) {
      return Response.json(
        { error: "Weighbridge reading ID is required", success: false },
        { status: 400 }
      );
    }

    if (!coffeeType || !["ARABICA", "ROBUSTA"].includes(coffeeType)) {
      return Response.json(
        {
          error: "Valid coffee type is required (ARABICA or ROBUSTA)",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!moistureContent || moistureContent < 100 || moistureContent > 300) {
      return Response.json(
        {
          error: "Moisture content must be between 100 and 300 (10% - 30%)",
          success: false,
        },
        { status: 400 }
      );
    }

    if (!pricePerKgUGX || pricePerKgUGX < 1000 || pricePerKgUGX > 50000) {
      return Response.json(
        {
          error: "Price per kg must be between 1,000 and 50,000 UGX",
          success: false,
        },
        { status: 400 }
      );
    }

    // Get weighbridge reading with all related data
    const reading = await db.weighbridgeReading.findUnique({
      where: { id: weighbridgeReadingId },
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
      },
    });

    if (!reading) {
      return Response.json(
        { error: "Weighbridge reading not found", success: false },
        { status: 404 }
      );
    }

    // Check if BWN already exists for this reading
    const existingBWN = await db.buyingWeightNote.findUnique({
      where: { weighbridgeReadingId },
    });

    if (existingBWN) {
      return Response.json(
        {
          error: `BWN already exists for this reading: ${existingBWN.bwnNumber}`,
          success: false,
        },
        { status: 400 }
      );
    }

    // Get trader ID from entry
    const traderId = reading.entry.traderId;
    if (!traderId) {
      return Response.json(
        {
          error: "Trader information not found in weighbridge entry",
          success: false,
        },
        { status: 400 }
      );
    }

    // Verify trader exists
    const trader = await db.trader.findUnique({
      where: { id: traderId },
    });

    if (!trader) {
      return Response.json(
        { error: "Trader not found", success: false },
        { status: 404 }
      );
    }

    // Calculate moisture deduction and final values
    const netWeightKg = reading.netWeightKg;
    const moistureDeductionKg = Math.max(
      0,
      Math.round((netWeightKg * (moistureContent - 115)) / 1000)
    );
    const finalNetWeightKg = Math.max(0, netWeightKg - moistureDeductionKg);
    const totalAmountUGX = finalNetWeightKg * pricePerKgUGX;

    // Generate BWN number
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const count = await db.buyingWeightNote.count();
    const bwnNumber = `BWN-${year}-${month}-${String(count + 1).padStart(4, "0")}`;

    // Create BWN in transaction
    const bwn = await db.buyingWeightNote.create({
      data: {
        bwnNumber,
        traderId,
        weighbridgeReadingId,
        deliveryDate: reading.timestamp,
        truckNumber: reading.entry.truckNumber,
        coffeeType,
        grossWeightKg: reading.grossWeightKg,
        tareWeightKg: reading.tareWeightKg,
        netWeightKg: reading.netWeightKg,
        moistureContent,
        moistureDeductionKg,
        finalNetWeightKg,
        pricePerKgUGX,
        totalAmountUGX: BigInt(totalAmountUGX),
        outturn: outturn || null,
        qualityAnalysisNo: qualityAnalysisNo || null,
        buyingCentre: buyingCentre || null,
        status: "WEIGHED",
        paymentStatus: "PENDING",
        createdById: session.user.id,
      },
      include: {
        trader: {
          select: {
            id: true,
            name: true,
            traderCode: true,
            phoneNumber: true,
          },
        },
        weighbridgeReading: {
          include: {
            entry: {
              select: {
                truckNumber: true,
                driverName: true,
              },
            },
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Serialize BigInt before sending response
    const serializedBwn = serializeBWN(bwn);

    return Response.json(
      {
        bwn: serializedBwn,
        success: true,
        message: `BWN ${bwnNumber} created successfully`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating buying weight note:", error);

    // Handle specific Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return Response.json(
          {
            error: "A BWN already exists for this weighbridge reading",
            success: false,
          },
          { status: 400 }
        );
      }
    }

    return Response.json(
      {
        error: "Failed to create buying weight note",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

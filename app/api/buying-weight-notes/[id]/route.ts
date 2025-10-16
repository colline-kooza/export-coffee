import db from "@/prisma/db";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id) {
      return Response.json(
        { error: "BWN ID is required", success: false },
        { status: 400 }
      );
    }

    const bwn = await db.buyingWeightNote.findUnique({
      where: { id },
      include: {
        trader: {
          select: {
            id: true,
            name: true,
            traderCode: true,
            phoneNumber: true,
            email: true,
            physicalAddress: true,
          },
        },
        weighbridgeReading: {
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
        moistureReadings: true,
        stockReceipts: true,
        payments: true,
      },
    });

    if (!bwn) {
      return Response.json(
        { error: "Buying weight note not found", success: false },
        { status: 404 }
      );
    }

    return Response.json(
      {
        bwn,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching buying weight note:", error);
    return Response.json(
      {
        error: "Failed to fetch buying weight note",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id) {
      return Response.json(
        { error: "BWN ID is required", success: false },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      coffeeType,
      moistureContent,
      pricePerKgUGX,
      outturn,
      qualityAnalysisNo,
      buyingCentre,
      status,
      paymentStatus,
    } = body;

    // Get existing BWN
    const existingBWN = await db.buyingWeightNote.findUnique({
      where: { id },
      include: {
        weighbridgeReading: true,
      },
    });

    if (!existingBWN) {
      return Response.json(
        { error: "Buying weight note not found", success: false },
        { status: 404 }
      );
    }

    // Recalculate if moisture or price changed
    let updateData: any = {
      coffeeType,
      outturn,
      qualityAnalysisNo,
      buyingCentre,
      status,
      paymentStatus,
    };

    if (moistureContent !== undefined || pricePerKgUGX !== undefined) {
      const newMoisture = moistureContent ?? existingBWN.moistureContent;
      const newPrice = pricePerKgUGX ?? existingBWN.pricePerKgUGX;

      const moistureDeductionKg = Math.round(
        (existingBWN.netWeightKg * (newMoisture - 115)) / 1000
      );
      const finalNetWeightKg = existingBWN.netWeightKg - moistureDeductionKg;
      const totalAmountUGX = finalNetWeightKg * newPrice;

      updateData = {
        ...updateData,
        moistureContent: newMoisture,
        pricePerKgUGX: newPrice,
        moistureDeductionKg,
        finalNetWeightKg,
        totalAmountUGX: BigInt(totalAmountUGX),
      };
    }

    // Update BWN
    const bwn = await db.buyingWeightNote.update({
      where: { id },
      data: updateData,
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
    });

    return Response.json(
      {
        bwn,
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating buying weight note:", error);
    return Response.json(
      {
        error: "Failed to update buying weight note",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  try {
    if (!id) {
      return Response.json(
        { error: "BWN ID is required", success: false },
        { status: 400 }
      );
    }

    // Check if BWN exists
    const existingBWN = await db.buyingWeightNote.findUnique({
      where: { id },
    });

    if (!existingBWN) {
      return Response.json(
        { error: "Buying weight note not found", success: false },
        { status: 404 }
      );
    }

    // Delete BWN
    await db.buyingWeightNote.delete({
      where: { id },
    });

    return Response.json(
      {
        success: true,
        message: "Buying weight note deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting buying weight note:", error);
    return Response.json(
      {
        error: "Failed to delete buying weight note",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

import db from "@/prisma/db";
import { type NextRequest, NextResponse } from "next/server";

// GET truck entry by ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const entry = await db.truckEntry.findUnique({
      where: { id },
      include: {
        securityOfficer: {
          select: { id: true, name: true, email: true, role: true },
        },
        weighbridgeReading: {
          include: {
            operator: { select: { id: true, name: true, email: true } },
            buyingWeightNote: true,
          },
        },
      },
    });

    if (!entry) {
      return NextResponse.json(
        { error: "Truck entry not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ entry, success: true });
  } catch (error) {
    console.error("Error fetching truck entry:", error);
    return NextResponse.json(
      { error: "Failed to fetch truck entry", success: false },
      { status: 500 }
    );
  }
}

// PATCH truck entry
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const entry = await db.truckEntry.update({
      where: { id },
      data: { ...body, updatedAt: new Date() },
      include: {
        securityOfficer: { select: { id: true, name: true, email: true } },
      },
    });

    return NextResponse.json({
      entry,
      success: true,
      message: "Truck entry updated successfully",
    });
  } catch (error) {
    console.error("Error updating truck entry:", error);
    return NextResponse.json(
      { error: "Failed to update truck entry", success: false },
      { status: 500 }
    );
  }
}

// DELETE truck entry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await db.truckEntry.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Truck entry deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting truck entry:", error);
    return NextResponse.json(
      { error: "Failed to delete truck entry", success: false },
      { status: 500 }
    );
  }
}

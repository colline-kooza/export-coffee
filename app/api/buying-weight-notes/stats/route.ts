import db from "@/prisma/db";

export async function GET() {
  try {
    const [
      totalBWNs,
      pendingBWNs,
      completedBWNs,
      totalAmount,
      arabicaCount,
      robustaCount,
    ] = await Promise.all([
      db.buyingWeightNote.count(),
      db.buyingWeightNote.count({
        where: {
          status: {
            in: [
              "PENDING_WEIGHING",
              "WEIGHED",
              "MOISTURE_TESTED",
              "PRICE_CALCULATED",
            ],
          },
        },
      }),
      db.buyingWeightNote.count({
        where: { status: "COMPLETED" },
      }),
      db.buyingWeightNote.aggregate({
        _sum: {
          totalAmountUGX: true,
        },
      }),
      db.buyingWeightNote.count({
        where: { coffeeType: "ARABICA" },
      }),
      db.buyingWeightNote.count({
        where: { coffeeType: "ROBUSTA" },
      }),
    ]);

    return Response.json(
      {
        stats: {
          totalBWNs,
          pendingBWNs,
          completedBWNs,
          totalAmount: totalAmount._sum.totalAmountUGX?.toString() || "0",
          arabicaCount,
          robustaCount,
        },
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching BWN stats:", error);
    return Response.json(
      {
        error: "Failed to fetch BWN stats",
        success: false,
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

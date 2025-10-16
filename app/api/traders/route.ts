import db from "@/prisma/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const search = url.searchParams.get("search") || "";
    const status = url.searchParams.get("status") || "";
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const where: any = {
      isActive: true,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { phoneNumber: { contains: search, mode: "insensitive" } },
        { traderCode: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [traders, totalCount] = await Promise.all([
      db.trader.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          performance: true,
          paymentTerms: true,
          _count: {
            select: {
              buyingWeightNotes: true,
              stockReceipts: true,
              payments: true,
            },
          },
        },
      }),
      db.trader.count({ where }),
    ]);

    return new Response(
      JSON.stringify({
        traders,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch traders" }), {
      status: 500,
    });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Generate trader code
    const count = await db.trader.count();
    const traderCode = `TRD-${new Date().getFullYear()}-${String(
      count + 1
    ).padStart(3, "0")}`;


    const trader = await db.trader.create({
      data: {
        name: data.name,
        phoneNumber: data.phoneNumber,
        email: data.email,
        contactPerson: data.contactPerson,
        district: data.district,
        physicalAddress: data.physicalAddress,
        traderCode, // generated
        status: data.status || "ACTIVE",
        trustScore: data.trustScore || 50,
        reliabilityScore: data.reliabilityScore || 50,
        totalDeliveries: 0,
        totalVolumeKg: 0,
        qualityAcceptanceRate: 0,

        // Nested relations
        performance: {
          create: {
            totalDeliveries: 0,
            totalVolumeKg: 0,
            acceptedDeliveries: 0,
            rejectedDeliveries: 0,
            borderlineDeliveries: 0,
            qualityConsistencyScore: 50,
            averageDefectCount: 0,
            averageMoistureContent: 0,
            onTimeDeliveryRate: 100,
          },
        },
        paymentTerms: {
          create: {
            paymentDays: 1,
            preferredMethod: data.preferredMethod, // ✅ here
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            accountName: data.accountName,
            mobileMoneyNumber: data.mobileMoneyNumber,
            mobileMoneyName: data.mobileMoneyName,
            requiresAdvance: data.requiresAdvance || false,
          },
        },
      },
      include: {
        performance: true,
        paymentTerms: true,
      },
    });

    return new Response(JSON.stringify(trader), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to create trader" }), {
      status: 500,
    });
  }
}

import db from "@/prisma/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const trader = await db.trader.findUnique({
      where: { id },
      include: {
        performance: true,
        paymentTerms: true,
        disputes: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        _count: {
          select: {
            buyingWeightNotes: true,
            stockReceipts: true,
            payments: true,
            disputes: true,
          },
        },
      },
    });

    if (!trader) {
      return new Response(JSON.stringify({ error: "Trader not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(trader), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch trader" }), {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await req.json();

    const trader = await db.trader.update({
      where: { id },
      data: {
        name: data.name,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        alternatePhone: data.alternatePhone,
        email: data.email,
        physicalAddress: data.physicalAddress,
        district: data.district,
        registrationNumber: data.registrationNumber,
        tinNumber: data.tinNumber,
        status: data.status,
        notes: data.notes,
        preferredPaymentDays: data.preferredPaymentDays,
      },
      include: {
        performance: true,
        paymentTerms: true,
      },
    });

    return new Response(JSON.stringify(trader), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to update trader" }), {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Soft delete by setting isActive to false
    await db.trader.update({
      where: { id },
      data: { isActive: false },
    });

    return new Response(
      JSON.stringify({ message: "Trader deactivated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to delete trader" }), {
      status: 500,
    });
  }
}

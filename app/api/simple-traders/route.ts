import db from "@/prisma/db";

export async function GET() {
  try {
    const traders = await db.trader.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    return new Response(JSON.stringify({ traders }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: "Failed to fetch traders" }), {
      status: 500,
    });
  }
}

import db from "@/prisma/db";

export async function GET() {
  try {
    const officers = await db.user.findMany({
      where: {
        isActive: true,
        role: "WAREHOUSE_INVENTORY_OFFICER",
      },
      select: {
        id: true,
        name: true,
      },
      orderBy: { name: "asc" },
    });

    // Return only the array of officers (not wrapped in { traders })
    return new Response(JSON.stringify(officers), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to fetch officers" }), {
      status: 500,
    });
  }
}

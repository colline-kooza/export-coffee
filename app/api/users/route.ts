// import { getAuthUser } from "@/lib/auth";
import db from "@/prisma/db";
// const API_KEY = process.env.API_KEY || "";

export async function GET() {
  try {
  
    const users = await db.user.findMany({
      orderBy: { createdAt: "desc" },
      where: {
        role: "USER",
      },
    });
    return new Response(JSON.stringify(users), {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify([]), {
      status: 500,
    });
  }
}

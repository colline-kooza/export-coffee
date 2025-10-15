import db from "@/prisma/db";
// import { NextRequest } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await request.json();

    const existingUser = await db.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingUser) {
      return new Response(
        JSON.stringify({
          error: "This User does not exist",
        }),
        {
          status: 404,
        }
      );
    }
    const updatedUser = await db.user.update({
      where: {
        id: id,
      },
      data: {
        role: data.role,
      },
    });
    return new Response(
      JSON.stringify({
        id: updatedUser.id,
        role: updatedUser.role,
      }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({
        error: "Something went wrong",
      }),
      {
        status: 500,
      }
    );
  }
}

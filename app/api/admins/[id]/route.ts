import db from "@/prisma/db";
import { NextRequest } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log(request);
  try {
    const id = (await params).id;

    const existingCode = await db.verificationCode.findUnique({
      where: {
        id: id,
      },
    });
    if (!existingCode) {
      return new Response(
        JSON.stringify({
          error: "This Code does not exist",
        }),
        {
          status: 404,
        }
      );
    }
    await db.verificationCode.delete({
      where: {
        id: id,
      },
    });
    return new Response(JSON.stringify(null), {
      status: 200,
    });
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

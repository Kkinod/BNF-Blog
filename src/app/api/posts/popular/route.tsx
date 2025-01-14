import { NextResponse } from "next/server";
import prisma from "@/utils/connect";
import { labels } from "@/views/labels";

export const GET = async () => {
  try {
    const posts = await prisma.post.findMany({
      take: 3,
      orderBy: {
        views: 'desc'
      },
      include: {
        user: true
      }
    });

    return new NextResponse(JSON.stringify(posts), { status: 200 });
  } catch (err) {
    console.log(err);
    return new NextResponse(
      JSON.stringify({ message: labels.errors.somethingWentWrong }), 
      { status: 500 }
    );
  }
}; 
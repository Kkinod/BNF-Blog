import { NextResponse } from "next/server";
import prisma from "@/utils/connect";

export interface Category {
	id: string;
	slug: string;
	title: string;
	img?: string;
}

export const GET = async () => {
	try {
		const categories = (await prisma.category.findMany()) as Category[];

		return new NextResponse(JSON.stringify(categories), { status: 200 });
	} catch (err) {
		console.log(err);
		return new NextResponse(JSON.stringify({ message: "Something went wrong!" }), { status: 500 });
	}
};

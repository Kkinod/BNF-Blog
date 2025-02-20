import { NextResponse } from "next/server";
import { prisma } from "@/utils/connect";
import { labels } from "@/views/labels";

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
		return new NextResponse(JSON.stringify({ message: labels.errors.somethingWentWrong }), {
			status: 500,
		});
	}
};

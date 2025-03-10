import { NextResponse } from "next/server";
import { prisma } from "@/shared/utils/connect";
import { handleApiError, methodNotAllowed } from "@/shared/utils/api-error-handler";

export interface Category {
	id: string;
	slug: string;
	title: string;
	img?: string;
}

export async function GET() {
	try {
		const categories = (await prisma.category.findMany()) as Category[];

		if (!categories || categories.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		return NextResponse.json(categories, { status: 200 });
	} catch (error) {
		return handleApiError(error);
	}
}

export async function POST() {
	return methodNotAllowed(["GET"]);
}

export async function PUT() {
	return methodNotAllowed(["GET"]);
}

export async function DELETE() {
	return methodNotAllowed(["GET"]);
}

export async function PATCH() {
	return methodNotAllowed(["GET"]);
}

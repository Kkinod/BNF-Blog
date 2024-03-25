import { type Category } from "@/app/api/categories/route";

export const getDataCategories = async (): Promise<Category[]> => {
	const res = await fetch("http://localhost:3000/api/categories", {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as Category[];
	return data;
};

import { type Category } from "@/app/api/categories/route";
import { getBaseUrl } from "@/utils/config";

export const getDataCategories = async (): Promise<Category[]> => {
	const res = await fetch(`${getBaseUrl()}/api/categories`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as Category[];
	return data;
};

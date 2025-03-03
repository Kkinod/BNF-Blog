import { type PromiseGetData } from "../singlePost/request";
import { getBaseUrl } from "@/config/config";

export const getPopularPosts = async (): Promise<PromiseGetData[]> => {
	const res = await fetch(`${getBaseUrl}/api/posts/popular`, {
		next: { revalidate: 10 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch popular posts");
	}

	const data = (await res.json()) as PromiseGetData[];
	return data;
};

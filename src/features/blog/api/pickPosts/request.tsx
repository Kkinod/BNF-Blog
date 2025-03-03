import { type PromiseGetData } from "../singlePost/request";
import { getBaseUrl } from "@/config/config";

export const getPickPosts = async (): Promise<PromiseGetData[]> => {
	const res = await fetch(`${getBaseUrl}/api/posts/pick`, {
		next: { revalidate: 10 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch picked posts");
	}

	const data = (await res.json()) as PromiseGetData[];
	return data;
};

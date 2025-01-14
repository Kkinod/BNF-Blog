import { type PromiseGetData } from "../singlePost/request";

export const getPopularPosts = async (): Promise<PromiseGetData[]> => {
	const res = await fetch(`http://localhost:3000/api/posts/popular`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed to fetch popular posts");
	}

	const data = (await res.json()) as PromiseGetData[];
	return data;
};

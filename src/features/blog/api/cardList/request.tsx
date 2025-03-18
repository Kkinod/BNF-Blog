import { getBaseUrl } from "@/config/config";
import { type PostsResponse } from "@/app/api/posts/route";

export const getDataCardList = async (page: number, cat?: string): Promise<PostsResponse> => {
	const res = await fetch(`${getBaseUrl}/api/posts?page=${page}&cat=${cat || ""}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as PostsResponse;
	return data;
};

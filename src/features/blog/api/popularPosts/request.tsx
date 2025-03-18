import { type PopularPost } from "@/app/api/posts/popular/route";
import { getBaseUrl } from "@/config/config";

export const getPopularPosts = async (): Promise<PopularPost[]> => {
	const res = await fetch(`${getBaseUrl}/api/posts/popular`, {
		next: { revalidate: 10 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch popular posts");
	}

	const data = (await res.json()) as PopularPost[];
	return data;
};

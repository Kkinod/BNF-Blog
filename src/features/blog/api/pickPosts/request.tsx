import { type PickPost } from "@/app/api/posts/pick/route";
import { getBaseUrl } from "@/config/config";

export const getPickPosts = async (): Promise<PickPost[]> => {
	const res = await fetch(`${getBaseUrl}/api/posts/pick`, {
		next: { revalidate: 10 },
	});

	if (!res.ok) {
		throw new Error("Failed to fetch picked posts");
	}

	const data = (await res.json()) as PickPost[];
	return data;
};

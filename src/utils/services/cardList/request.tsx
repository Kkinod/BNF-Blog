import { type PostCard } from "@/components/organisms/Card/Card";
import { getBaseUrl } from "@/utils/config";

interface PromiseGetData {
	posts: PostCard[];
	count: number;
}

export const getDataCardList = async (page: number, cat?: string): Promise<PromiseGetData> => {
	const res = await fetch(`${getBaseUrl()}/api/posts?page=${page}&cat=${cat || ""}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as PromiseGetData;
	return data;
};

import { type Posts } from "@/app/api/posts/route";

export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: string | null;
	image: string;
}

export interface PromiseGetData extends Omit<Posts, "createdAt"> {
	user: User;
	createdAt: string;
}

export const getDataSinglePost = async (slug: string): Promise<PromiseGetData> => {
	const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as PromiseGetData;
	return data;
};

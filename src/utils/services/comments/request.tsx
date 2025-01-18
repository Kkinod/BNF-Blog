import useSWR, { type KeyedMutator } from "swr";
import { type User } from "@/app/api/posts/[slug]/route";

export interface Comment {
	createdAt: string;
	desc: string;
	id: string;
	postSlug: string;
	user: User;
	userEmail: string;
	message: string;
}

interface ErrorResponse {
	message: string;
}

interface handleSubmitComment {
	mutate: KeyedMutator<Comment[]>;
	desc: string;
	postSlug: string;
}

const baseUrl = `/api/comments`;

export const fetcher = async (url: string): Promise<Comment[]> => {
	const res: Response = await fetch(url);

	const data = (await res.json()) as Comment[];

	if (!res.ok) {
		const errorData = (await res.json()) as ErrorResponse;
		throw new Error(errorData.message);
	}

	return data;
};

export const useComments = (postSlug: string) => {
	const { data, isLoading, mutate } = useSWR<Comment[]>(`${baseUrl}?postSlug=${postSlug}`, fetcher);

	return {
		data,
		isLoading,
		mutate,
	};
};

export const handleSubmitComment = async ({ mutate, desc, postSlug }: handleSubmitComment) => {
	fetch(`/api/comments`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ desc, postSlug }),
	})
		.then(() => mutate())
		.catch(console.error);
};

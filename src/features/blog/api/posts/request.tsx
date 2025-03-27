import { toast } from "sonner";
import { type ListPost } from "@/app/api/posts/route";
import { labels } from "@/shared/utils/labels";

interface ApiErrorResponse {
	error: string;
	message?: string;
}

export interface Post {
	id: string;
	title: string;
	desc: string;
	catSlug: string;
	slug: string;
	img?: string;
}

export interface PostUpdateData {
	id: string;
	title: string;
	desc: string;
	img?: string;
	catSlug: string;
}

export interface PostCreateData {
	title: string;
	desc: string;
	img?: string;
	catSlug: string;
}

export interface PostResponse {
	id?: string;
	slug?: string;
	message?: string;
	[key: string]: unknown;
}

export const fetchPosts = async () => {
	try {
		const response = await fetch(`/api/posts?all=true`);
		const { posts } = (await response.json()) as { posts: ListPost[] };
		return posts;
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		return [];
	}
};

export const togglePostVisibility = async (post: ListPost) => {
	try {
		const response = await fetch(`/api/posts/visibility`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				postId: post.id,
				isVisible: !post.isVisible,
			}),
		});

		if (!response.ok) {
			const data = (await response.json()) as ApiErrorResponse;
			throw new Error(data.message);
		}

		if (post.isVisible) {
			toast.warning(labels.posts.hiddenSuccessfully);
		} else {
			toast.success(labels.posts.visibleSuccessfully);
		}

		return true;
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		return false;
	}
};

export const togglePostPick = async (post: ListPost) => {
	try {
		const response = await fetch(`/api/posts/pick`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				postId: post.id,
				isPick: !post.isPick,
			}),
		});

		if (!response.ok) {
			const data = (await response.json()) as ApiErrorResponse;
			throw new Error(data.message);
		}

		if (post.isPick) {
			toast.warning(labels.posts.unpickedSuccessfully);
		} else {
			toast.success(labels.posts.pickedSuccessfully);
		}

		return true;
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		return false;
	}
};

export const getPostByIdOrSlug = async (postIdOrSlug: string): Promise<Post | null> => {
	try {
		const res = await fetch(`/api/posts/${postIdOrSlug}`);

		if (!res.ok) {
			if (process.env.NODE_ENV === "development") {
				console.error(`[DEV] Failed to fetch post: ${res.status}`);
			}
			throw new Error(`Failed to fetch post: ${res.status}`);
		}

		return (await res.json()) as Post;
	} catch (error) {
		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error fetching post:", error);
		}
		return null;
	}
};

export const updatePost = async (postData: PostUpdateData): Promise<PostResponse | null> => {
	try {
		const res = await fetch("/api/posts", {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		});

		const data = (await res.json()) as PostResponse;

		if (res.ok) {
			toast.success(labels.writePost.postSavedSuccess);
			return data;
		}

		const errorMessages = {
			401: labels.errors.unauthorized,
			403: labels.errors.forbidden,
			404: labels.errors.postNotFound,
			409: labels.errors.postTitleExists,
		} as const;

		const errorMessage =
			errorMessages[res.status as keyof typeof errorMessages] ||
			data.message ||
			labels.errors.savingPostFailed;
		toast.error(errorMessage);

		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error updating post:", data);
		}

		return null;
	} catch (error) {
		toast.error(labels.errors.savingPostFailed);
		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error updating post:", error);
		}
		return null;
	}
};

export const createPost = async (postData: PostCreateData): Promise<PostResponse | null> => {
	try {
		const res = await fetch("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(postData),
		});

		const data = (await res.json()) as PostResponse;

		if (res.ok) {
			toast.success(labels.writePost.postSavedSuccess);
			return data;
		}

		const errorMessages = {
			401: labels.errors.unauthorized,
			403: labels.errors.forbidden,
			409: labels.errors.postTitleExists,
		} as const;

		const errorMessage =
			errorMessages[res.status as keyof typeof errorMessages] ||
			data.message ||
			labels.errors.savingPostFailed;
		toast.error(errorMessage);

		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error creating post:", data);
		}

		return null;
	} catch (error) {
		toast.error(labels.errors.savingPostFailed);
		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error creating post:", error);
		}
		return null;
	}
};

export const deletePost = async (postId: string): Promise<boolean> => {
	try {
		const res = await fetch(`/api/posts?id=${postId}`, {
			method: "DELETE",
		});

		if (res.ok) {
			toast.success(labels.posts.deleteSuccess);
			return true;
		}

		const data = (await res.json()) as ApiErrorResponse;

		const errorMessages = {
			401: labels.errors.unauthorized,
			403: labels.errors.forbidden,
			404: labels.errors.postNotFound,
		} as const;

		const errorMessage =
			errorMessages[res.status as keyof typeof errorMessages] ||
			data.message ||
			labels.errors.somethingWentWrong;
		toast.error(errorMessage);

		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error deleting post:", data);
		}

		return false;
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error deleting post:", error);
		}
		return false;
	}
};

export const searchPosts = async (
	query: string,
	category?: string,
): Promise<{ posts: ListPost[]; count: number }> => {
	try {
		const encodedQuery = encodeURIComponent(query.trim());
		let url = `/api/posts/search?query=${encodedQuery}`;

		if (category) {
			url += `&category=${encodeURIComponent(category)}`;
		}

		const response = await fetch(url);
		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message);
		}

		return data as { posts: ListPost[]; count: number };
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		if (process.env.NODE_ENV === "development") {
			console.error("[DEV] Error searching posts:", error);
		}
		return { posts: [], count: 0 };
	}
};

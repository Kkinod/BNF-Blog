import { toast } from "sonner";
import { type Posts } from "@/app/api/posts/route";
import { labels } from "@/views/labels";

interface ApiErrorResponse {
	error: string;
	message?: string;
}

export const fetchPosts = async () => {
	try {
		const response = await fetch(`/api/posts?all=true`);
		const { posts } = (await response.json()) as { posts: Posts[] };
		return posts;
	} catch (error) {
		toast.error(labels.errors.somethingWentWrong);
		return [];
	}
};

export const togglePostVisibility = async (post: Posts) => {
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

export const togglePostPick = async (post: Posts) => {
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

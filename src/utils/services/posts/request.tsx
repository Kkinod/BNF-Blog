import { toast } from "sonner";
import { type Posts } from "@/app/api/posts/route";
import { labels } from "@/views/labels";

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
		const response = await fetch("/api/posts/visibility", {
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
			throw new Error();
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

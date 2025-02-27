import { useReducer, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/utils/routes";
import { type Posts } from "@/app/api/posts/route";
import { labels } from "@/views/labels";

interface PostFormState {
	title: string;
	content: string;
	categorySlug: string;
	errors: {
		title: boolean;
		category: boolean;
		content: boolean;
	};
}

type PostFormAction =
	| { type: "SET_TITLE"; payload: string }
	| { type: "SET_CONTENT"; payload: string }
	| { type: "SET_CATEGORY"; payload: string }
	| { type: "RESET_ERRORS" }
	| { type: "SET_ERRORS"; payload: { [key: string]: boolean } };

const initialState: PostFormState = {
	title: "",
	content: "",
	categorySlug: "",
	errors: {
		title: false,
		category: false,
		content: false,
	},
};

function postFormReducer(state: PostFormState, action: PostFormAction): PostFormState {
	switch (action.type) {
		case "SET_TITLE":
			return { ...state, title: action.payload };
		case "SET_CONTENT":
			return { ...state, content: action.payload };
		case "SET_CATEGORY":
			return { ...state, categorySlug: action.payload };
		case "RESET_ERRORS":
			return { ...state, errors: initialState.errors };
		case "SET_ERRORS":
			return { ...state, errors: { ...state.errors, ...action.payload } };
		default:
			return state;
	}
}

export const usePostForm = (mediaUrl: string) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(postFormReducer, initialState);

	const slugify = useCallback((str: string) => {
		const iMap: { [key: string]: string } = {
			ð: "d",
			ı: "i",
			Ł: "L",
			ł: "l",
			ø: "o",
			ß: "ss",
			ü: "ue",
		};

		const iRegex = new RegExp(Object.keys(iMap).join("|"), "g");
		return str
			.replace(iRegex, (m) => iMap[m])
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_-]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}, []);

	const validateForm = useCallback(() => {
		const newErrors = {
			title: !state.title.trim(),
			category: !state.categorySlug,
			content: !state.content.trim(),
		};

		dispatch({ type: "SET_ERRORS", payload: newErrors });
		return !Object.values(newErrors).some(Boolean);
	}, [state.title, state.categorySlug, state.content]);

	const handleSubmit = useCallback(async () => {
		dispatch({ type: "RESET_ERRORS" });

		if (!validateForm()) {
			return;
		}

		try {
			const res = await fetch("/api/posts", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					title: state.title,
					desc: state.content,
					img: mediaUrl,
					slug: slugify(state.title),
					catSlug: state.categorySlug,
				}),
			});

			const post: Posts = (await res.json()) as Posts;

			if (res.ok && post.slug) {
				toast.success(labels.writePost.postSavedSuccess);
				router.push(routes.post(post.slug, state.categorySlug));
			} else {
				toast.error(labels.errors.savingPostFailed);
			}
		} catch (error) {
			toast.error(labels.errors.savingPostFailed);
			if (process.env.NODE_ENV === "development") {
				console.error("[DEV] Error saving post:", error);
			}
		}
	}, [state, mediaUrl, router, slugify, validateForm]);

	return {
		title: state.title,
		content: state.content,
		categorySlug: state.categorySlug,
		errors: state.errors,
		setTitle: (title: string) => dispatch({ type: "SET_TITLE", payload: title }),
		setContent: (content: string) => dispatch({ type: "SET_CONTENT", payload: content }),
		setCategorySlug: (category: string) => dispatch({ type: "SET_CATEGORY", payload: category }),
		handleSubmit,
	};
};

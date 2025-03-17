import { useReducer, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/utils/routes";
import { createPost } from "@/features/blog/api/posts/request";
import { labels } from "@/shared/utils/labels";

interface PostFormState {
	title: string;
	content: string;
	categorySlug: string;
	isSubmitting: boolean;
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
	| { type: "SET_SUBMITTING"; payload: boolean }
	| { type: "RESET_ERRORS" }
	| { type: "SET_ERRORS"; payload: { [key: string]: boolean } };

const initialState: PostFormState = {
	title: "",
	content: "",
	categorySlug: "",
	isSubmitting: false,
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
		case "SET_SUBMITTING":
			return { ...state, isSubmitting: action.payload };
		case "RESET_ERRORS":
			return { ...state, errors: initialState.errors };
		case "SET_ERRORS":
			return { ...state, errors: { ...state.errors, ...action.payload } };
		default:
			return state;
	}
}

export const useCreatePostForm = (mediaUrl: string) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(postFormReducer, initialState);
	const [error, setError] = useState<string | null>(null);

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
		setError(null);

		if (!validateForm()) {
			return;
		}

		try {
			dispatch({ type: "SET_SUBMITTING", payload: true });

			const postData = {
				title: state.title,
				desc: state.content,
				img: mediaUrl,
				catSlug: state.categorySlug,
			};

			const response = await createPost(postData);

			if (response) {
				const slug = response.slug || "";
				router.push(routes.post(slug, state.categorySlug));
			}
		} catch (err) {
			setError(labels.errors.savingPostFailed);
			if (process.env.NODE_ENV === "development") {
				console.error("[DEV] Error creating post:", err);
			}
		} finally {
			dispatch({ type: "SET_SUBMITTING", payload: false });
		}
	}, [state, mediaUrl, router, validateForm]);

	return {
		title: state.title,
		content: state.content,
		categorySlug: state.categorySlug,
		isSubmitting: state.isSubmitting,
		errors: state.errors,
		error,
		setTitle: (title: string) => dispatch({ type: "SET_TITLE", payload: title }),
		setContent: (content: string) => dispatch({ type: "SET_CONTENT", payload: content }),
		setCategorySlug: (category: string) => dispatch({ type: "SET_CATEGORY", payload: category }),
		handleSubmit,
	};
};

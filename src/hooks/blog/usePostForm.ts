import { useReducer, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { routes } from "@/shared/utils/routes";
import { labels } from "@/shared/utils/labels";

interface PostResponse {
	id?: string;
	slug?: string;
	message?: string;
	[key: string]: unknown;
}

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

export const usePostForm = (mediaUrl: string) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(postFormReducer, initialState);

	useEffect(() => {
		return () => {
			dispatch({ type: "SET_SUBMITTING", payload: false });
		};
	}, []);

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
			dispatch({ type: "SET_SUBMITTING", payload: true });

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
					isVisible: true,
				}),
			});

			const data = (await res.json()) as PostResponse;

			if (res.ok && data.slug) {
				toast.success(labels.writePost.postSavedSuccess);
				router.push(routes.post(data.slug, state.categorySlug));
				return;
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
				console.error("[DEV] Error saving post:", data);
			}
			dispatch({ type: "SET_SUBMITTING", payload: false });
		} catch (error) {
			toast.error(labels.errors.savingPostFailed);
			if (process.env.NODE_ENV === "development") {
				console.error("[DEV] Error saving post:", error);
			}
			dispatch({ type: "SET_SUBMITTING", payload: false });
		}
	}, [state, mediaUrl, router, slugify, validateForm]);

	return {
		title: state.title,
		content: state.content,
		categorySlug: state.categorySlug,
		isSubmitting: state.isSubmitting,
		errors: state.errors,
		setTitle: (title: string) => dispatch({ type: "SET_TITLE", payload: title }),
		setContent: (content: string) => dispatch({ type: "SET_CONTENT", payload: content }),
		setCategorySlug: (category: string) => dispatch({ type: "SET_CATEGORY", payload: category }),
		handleSubmit,
	};
};

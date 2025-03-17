import { useReducer, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/utils/routes";
import { labels } from "@/shared/utils/labels";
import { getPostByIdOrSlug, updatePost } from "@/features/blog/api/posts/request";

interface PostFormState {
	id: string;
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
	| { type: "SET_ERRORS"; payload: { [key: string]: boolean } }
	| { type: "INITIALIZE_FORM"; payload: Partial<PostFormState> };

const initialState: PostFormState = {
	id: "",
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
		case "INITIALIZE_FORM":
			return { ...state, ...action.payload };
		default:
			return state;
	}
}

export const useEditPostForm = (
	postIdOrSlug: string,
	mediaUrl: string,
	setImageUrl: (url: string) => void,
) => {
	const router = useRouter();
	const [state, dispatch] = useReducer(postFormReducer, initialState);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [postId, setPostId] = useState<string>("");

	// Fetch post data on mount
	useEffect(() => {
		const fetchPost = async () => {
			try {
				setIsLoading(true);
				setError(null);

				const post = await getPostByIdOrSlug(postIdOrSlug);

				if (!post) {
					throw new Error(labels.errors.postNotFound);
				}

				setPostId(post.id); // Store the post ID for later use

				// Initialize form with post data
				dispatch({
					type: "INITIALIZE_FORM",
					payload: {
						id: post.id,
						title: post.title,
						content: post.desc,
						categorySlug: post.catSlug,
					},
				});

				// Set image URL if available
				if (post.img) {
					setImageUrl(post.img);
				}
			} catch (error) {
				setError(labels.errors.postNotFound);
			} finally {
				setIsLoading(false);
			}
		};

		if (postIdOrSlug) {
			void fetchPost();
		}
	}, [postIdOrSlug, setImageUrl]);

	useEffect(() => {
		return () => {
			dispatch({ type: "SET_SUBMITTING", payload: false });
		};
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

			const postUpdateData = {
				id: postId,
				title: state.title,
				desc: state.content,
				img: mediaUrl,
				catSlug: state.categorySlug,
			};

			const response = await updatePost(postUpdateData);

			if (response) {
				const slug = response.slug || "";
				router.push(routes.post(slug, state.categorySlug));
			}
		} finally {
			dispatch({ type: "SET_SUBMITTING", payload: false });
		}
	}, [state, mediaUrl, router, validateForm, postId]);

	return {
		isLoading,
		error,
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

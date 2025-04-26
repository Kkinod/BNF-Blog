import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { PostFormView } from "./PostFormView";
import * as categoriesService from "@/features/blog/api/categories/request";

jest.mock("next-auth/react");
jest.mock("sonner");
jest.mock("@/features/blog/api/categories/request");

const mockUseImageUpload = {
	setFile: jest.fn(),
	imageUrl: "https://example.com/image.jpg",
	uploadProgress: 0,
	isUploading: false,
	resetUpload: jest.fn(),
	cancelUpload: jest.fn(),
	setImageUrl: jest.fn(),
	error: null,
};

jest.mock("@/hooks/blog/useImageUpload", () => ({
	useImageUpload: () => mockUseImageUpload,
}));

jest.mock("react-quill", () => {
	return function DummyQuill({
		value,
		onChange,
		placeholder,
		"aria-label": ariaLabel,
		className,
	}: {
		value?: string;
		onChange?: (value: string) => void;
		placeholder?: string;
		"aria-label"?: string;
		className?: string;
	}) {
		const handleChange = (e: React.ChangeEvent<HTMLDivElement>) => {
			if (onChange) {
				onChange(e.target.textContent || "");
			}
		};

		return (
			<div className={className} data-testid="quill-editor">
				<div contentEditable role="textbox" aria-label={ariaLabel} onInput={handleChange}>
					{value || placeholder}
				</div>
			</div>
		);
	};
});

const mockUsePostForm = {
	title: "",
	content: "",
	categorySlug: "",
	errors: { title: false, category: false, content: false },
	isSubmitting: false,
	setTitle: jest.fn(),
	setContent: jest.fn(),
	setCategorySlug: jest.fn(),
	handleSubmit: jest.fn(),
};

jest.mock("@/hooks/blog/usePostForm", () => ({
	usePostForm: () => mockUsePostForm,
}));

const mockUseEditPostForm = {
	isLoading: false,
	error: null as string | null,
	title: "Existing Post Title",
	content: "Existing Post Content",
	categorySlug: "technology",
	errors: { title: false, category: false, content: false },
	isSubmitting: false,
	setTitle: jest.fn(),
	setContent: jest.fn(),
	setCategorySlug: jest.fn(),
	handleSubmit: jest.fn(),
};

jest.mock("@/hooks/blog/useEditPostForm", () => ({
	useEditPostForm: () => mockUseEditPostForm,
}));

describe("PostFormView Component", () => {
	const mockCategories = [
		{ id: "1", title: "Technology", slug: "technology" },
		{ id: "2", title: "Journal", slug: "journal" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(categoriesService.getDataCategories as jest.Mock).mockResolvedValue(mockCategories);

		mockUseImageUpload.imageUrl = "https://example.com/image.jpg";
		mockUseImageUpload.uploadProgress = 0;
		mockUseImageUpload.isUploading = false;
		mockUsePostForm.isSubmitting = false;
		mockUseEditPostForm.isLoading = false;
		mockUseEditPostForm.error = null;
		mockUseEditPostForm.isSubmitting = false;
	});

	it("shows loading overlay when session status is loading", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "loading",
			data: null,
		});

		render(<PostFormView mode="create" />);

		const overlay = screen.getByRole("status").closest(".writePage__submitting-overlay");
		expect(overlay).toBeInTheDocument();
	});

	it("shows unauthorized message when user is not authenticated", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "unauthenticated",
			data: null,
		});

		render(<PostFormView mode="create" />);
		expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
	});

	it("renders the create post form when user is authenticated and mode is create", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<PostFormView mode="create" />);

		expect(screen.getByText("Create New Post")).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		await waitFor(() => {
			expect(categoriesService.getDataCategories).toHaveBeenCalledTimes(1);
		});
	});

	it("renders the edit post form when user is authenticated and mode is edit", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<PostFormView postId="123" mode="edit" />);

		expect(screen.getByText("Edit Post")).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		expect(screen.getByRole("textbox", { name: /post title/i })).toHaveValue("Existing Post Title");

		await waitFor(() => {
			expect(categoriesService.getDataCategories).toHaveBeenCalledTimes(1);
		});
	});

	it("shows error message when edit mode has an error", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUseEditPostForm.error = "Post Not Found";

		render(<PostFormView postId="123" mode="edit" />);
		expect(screen.getByText("Post Not Found")).toBeInTheDocument();
	});

	it("shows loading overlay when edit mode is loading post data", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUseEditPostForm.isLoading = true;

		render(<PostFormView postId="123" mode="edit" />);

		const overlay = screen.getByRole("status").closest(".writePage__submitting-overlay");
		expect(overlay).toBeInTheDocument();
	});

	it("shows error toast when categories fetch fails", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		const error = new Error("Failed to fetch categories");
		(categoriesService.getDataCategories as jest.Mock).mockRejectedValue(error);

		render(<PostFormView mode="create" />);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalled();
		});
	});

	it("renders all form components correctly in create mode", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<PostFormView mode="create" />);

		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		await waitFor(() => {
			const categorySelector = screen.getByText("Select category");
			expect(categorySelector).toBeInTheDocument();
		});

		expect(screen.getByRole("button", { name: /show media upload options/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /publish post/i })).toBeInTheDocument();
		expect(screen.getByAltText("Uploaded image preview")).toBeInTheDocument();
	});

	it("renders all form components correctly in edit mode", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<PostFormView postId="123" mode="edit" />);

		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		await waitFor(() => {
			const categoryButton =
				screen.getByRole("button", { name: /technology/i }) ||
				screen.getByRole("button", { name: /loading/i });
			expect(categoryButton).toBeInTheDocument();
		});

		expect(screen.getByRole("button", { name: /show media upload options/i })).toBeInTheDocument();

		const updateButton = screen.getByText("Update Post");
		expect(updateButton).toBeInTheDocument();

		expect(screen.getByAltText("Uploaded image preview")).toBeInTheDocument();
	});

	it("disables publish button when upload is in progress", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUseImageUpload.imageUrl = "";
		mockUseImageUpload.uploadProgress = 50;
		mockUseImageUpload.isUploading = true;

		render(<PostFormView mode="create" />);

		const publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});

	it("disables publish button when form is submitting in create mode", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUsePostForm.isSubmitting = true;

		render(<PostFormView mode="create" />);

		const publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});

	it("disables update button when form is submitting in edit mode", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUseEditPostForm.isSubmitting = true;

		render(<PostFormView postId="123" mode="edit" />);

		const updateButton = screen.getByText("Update Post");
		const buttonElement = updateButton.closest("button");
		expect(buttonElement).toBeDisabled();
	});

	it("shows overlay with loader when form is submitting", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUsePostForm.isSubmitting = true;

		render(<PostFormView mode="create" />);

		const overlay = screen.getByRole("status").closest(".writePage__submitting-overlay");
		expect(overlay).toBeInTheDocument();
	});
});

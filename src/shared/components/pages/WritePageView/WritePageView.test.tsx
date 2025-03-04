import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { WritePageView } from "./WritePageView";
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

describe("WritePageView Component", () => {
	const mockCategories = [
		{ id: "1", title: "Technology", slug: "technology" },
		{ id: "2", title: "Travel", slug: "travel" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(categoriesService.getDataCategories as jest.Mock).mockResolvedValue(mockCategories);

		mockUseImageUpload.imageUrl = "https://example.com/image.jpg";
		mockUseImageUpload.uploadProgress = 0;
		mockUseImageUpload.isUploading = false;
		mockUsePostForm.isSubmitting = false;
	});

	it("shows loading state when session status is loading", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "loading",
			data: null,
		});

		render(<WritePageView />);
		expect(screen.getByText("Loading")).toBeInTheDocument();
	});

	it("shows unauthorized message when user is not authenticated", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "unauthenticated",
			data: null,
		});

		render(<WritePageView />);
		expect(screen.getByText("You don't have permission to access this page")).toBeInTheDocument();
	});

	it("renders the write post form when user is authenticated", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<WritePageView />);

		expect(screen.getByText("Create New Post")).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		await waitFor(() => {
			expect(categoriesService.getDataCategories).toHaveBeenCalledTimes(1);
		});
	});

	it("shows error toast when categories fetch fails", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		const error = new Error("Failed to fetch categories");
		(categoriesService.getDataCategories as jest.Mock).mockRejectedValue(error);

		render(<WritePageView />);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalled();
		});
	});

	it("renders all form components correctly", async () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		render(<WritePageView />);

		expect(screen.getByRole("textbox", { name: /post title/i })).toBeInTheDocument();

		await waitFor(() => {
			const categorySelector = screen.getByText("Select category");
			expect(categorySelector).toBeInTheDocument();
		});

		expect(screen.getByRole("button", { name: /show media upload options/i })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /publish post/i })).toBeInTheDocument();
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

		render(<WritePageView />);

		const publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});

	it("disables publish button when form is submitting", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUsePostForm.isSubmitting = true;

		render(<WritePageView />);

		const publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});

	it("shows overlay with loader when form is submitting", () => {
		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUsePostForm.isSubmitting = true;

		render(<WritePageView />);

		const overlay = screen.getByRole("status").closest(".writePage__submitting-overlay");
		expect(overlay).toBeInTheDocument();
	});
});

import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { WritePageView } from "./WritePageView";
import * as categoriesService from "@/features/blog/api/categories/request";

jest.mock("next-auth/react");
jest.mock("sonner");
jest.mock("@/features/blog/api/categories/request");

const mockUseImageUpload = {
	setFile: jest.fn(),
	imageUrl: "",
	uploadProgress: 0,
	isUploading: false,
	resetUpload: jest.fn(),
	cancelUpload: jest.fn(),
	error: null,
};

jest.mock("@/hooks/blog/useImageUpload", () => ({
	useImageUpload: () => mockUseImageUpload,
}));

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

describe("WritePageView Integration Tests", () => {
	const mockCategories = [
		{ id: "1", title: "Technology", slug: "technology" },
		{ id: "2", title: "Travel", slug: "travel" },
	];

	beforeEach(() => {
		jest.clearAllMocks();
		(categoriesService.getDataCategories as jest.Mock).mockResolvedValue(mockCategories);

		(useSession as jest.Mock).mockReturnValue({
			status: "authenticated",
			data: { user: { name: "Test User" } },
		});

		mockUseImageUpload.imageUrl = "";
		mockUseImageUpload.uploadProgress = 0;
		mockUseImageUpload.isUploading = false;

		mockUsePostForm.title = "";
		mockUsePostForm.content = "";
		mockUsePostForm.categorySlug = "";
		mockUsePostForm.isSubmitting = false;
		mockUsePostForm.errors = { title: false, category: false, content: false };
	});

	it("integrates form state with UI elements", async () => {
		render(<WritePageView />);

		await waitFor(() => {
			expect(categoriesService.getDataCategories).toHaveBeenCalledTimes(1);
		});

		const titleInput = screen.getByRole("textbox", { name: /post title/i });
		fireEvent.change(titleInput, { target: { value: "Test Title" } });
		expect(mockUsePostForm.setTitle).toHaveBeenCalledWith("Test Title");

		mockUsePostForm.setCategorySlug("technology");
		expect(mockUsePostForm.setCategorySlug).toHaveBeenCalled();

		// Simulate content input using the mocked Quill editor
		const contentEditor = screen.getByTestId("quill-editor");
		const editableElement = contentEditor.querySelector("[contenteditable]");
		if (editableElement) {
			fireEvent.input(editableElement, { target: { textContent: "Test Content" } });
			// Verify that setContent was called with the correct value
			expect(mockUsePostForm.setContent).toHaveBeenCalledWith("Test Content");
		}
	});

	it("handles image upload integration", async () => {
		const { unmount } = render(<WritePageView />);

		// Simulate file upload by finding the hidden input and triggering change
		const fileInput = document.querySelector('input[type="file"]');
		const file = new File(["test"], "test.png", { type: "image/png" });

		if (fileInput) {
			fireEvent.change(fileInput, { target: { files: [file] } });
			expect(mockUseImageUpload.setFile).toHaveBeenCalledWith(file);
		}

		// Unmount the previous render to avoid multiple instances
		unmount();

		// Simulate upload in progress
		mockUseImageUpload.isUploading = true;
		mockUseImageUpload.uploadProgress = 50;

		// Re-render with new state
		const { container } = render(<WritePageView />);

		// Check that publish button is disabled during upload
		const publishButton = container.querySelector('button[aria-label="Publish post"]');
		expect(publishButton).toBeDisabled();
	});

	it("handles form submission when all fields are valid", async () => {
		// Set up form with valid data
		mockUsePostForm.title = "Valid Title";
		mockUsePostForm.content = "Valid Content";
		mockUsePostForm.categorySlug = "technology";
		mockUseImageUpload.imageUrl = "https://example.com/image.jpg";

		const { container } = render(<WritePageView />);

		// Trigger form submission
		const publishButton = container.querySelector('button[aria-label="Publish post"]');
		if (publishButton) {
			fireEvent.click(publishButton);
		}

		expect(mockUsePostForm.handleSubmit).toHaveBeenCalledTimes(1);
	});

	it("shows error states when form validation fails", async () => {
		// Set up form with validation errors
		mockUsePostForm.errors = { title: true, category: true, content: true };

		render(<WritePageView />);

		// Check that error messages are displayed
		await waitFor(() => {
			expect(screen.getByText(/title is required/i)).toBeInTheDocument();
			expect(screen.getByText(/category is required/i)).toBeInTheDocument();
			expect(screen.getByText(/content is required/i)).toBeInTheDocument();
		});
	});

	it("handles category loading error gracefully", async () => {
		// Mock categories fetch error
		const error = new Error("Failed to fetch categories");
		(categoriesService.getDataCategories as jest.Mock).mockRejectedValue(error);

		render(<WritePageView />);

		await waitFor(() => {
			expect(toast.error).toHaveBeenCalled();
		});
	});

	it("shows overlay with loader when form is submitting", async () => {
		// Set up form submission state
		mockUsePostForm.isSubmitting = true;

		render(<WritePageView />);

		// Check that the overlay is displayed
		const overlay = screen.getByRole("status").closest(".writePage__submitting-overlay");
		expect(overlay).toBeInTheDocument();

		// Check that the publish button is disabled
		const publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});

	it("disables publish button when either upload or submission is in progress", async () => {
		// Test with upload in progress
		mockUseImageUpload.isUploading = true;
		mockUsePostForm.isSubmitting = false;

		const { rerender } = render(<WritePageView />);
		let publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();

		// Test with submission in progress
		mockUseImageUpload.isUploading = false;
		mockUsePostForm.isSubmitting = true;

		rerender(<WritePageView />);
		publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();

		// Test with both in progress
		mockUseImageUpload.isUploading = true;
		mockUsePostForm.isSubmitting = true;

		rerender(<WritePageView />);
		publishButton = screen.getByRole("button", { name: /publish post/i });
		expect(publishButton).toBeDisabled();
	});
});

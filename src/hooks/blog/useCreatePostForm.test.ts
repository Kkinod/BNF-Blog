import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useCreatePostForm } from "./useCreatePostForm";
import { routes } from "@/shared/utils/routes";
import { labels } from "@/shared/utils/labels";

jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
}));

describe("useCreatePostForm", () => {
	const mockPush = jest.fn();
	const mockMediaUrl = "https://example.com/image.jpg";

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
		global.fetch = jest.fn();
	});

	// Test initial state
	it("should initialize with default values", () => {
		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		expect(result.current.title).toBe("");
		expect(result.current.content).toBe("");
		expect(result.current.categorySlug).toBe("");
		expect(result.current.isSubmitting).toBe(false);
		expect(result.current.errors).toEqual({
			title: false,
			category: false,
			content: false,
		});
	});

	// Test state transformations
	it("should update title when setTitle is called", () => {
		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("New Title");
		});

		expect(result.current.title).toBe("New Title");
	});

	it("should update content when setContent is called", () => {
		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setContent("New Content");
		});

		expect(result.current.content).toBe("New Content");
	});

	it("should update categorySlug when setCategorySlug is called", () => {
		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setCategorySlug("new-category");
		});

		expect(result.current.categorySlug).toBe("new-category");
	});

	// Test form validation
	it("should set errors when form is submitted with empty fields", async () => {
		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(result.current.errors).toEqual({
			title: true,
			category: true,
			content: true,
		});
		expect(global.fetch).not.toHaveBeenCalled();
	});

	// Test successful submission
	it("should handle successful post creation", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue({ slug: "test-title" }),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(global.fetch).toHaveBeenCalledWith("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title: "Test Title",
				desc: "Test Content",
				img: mockMediaUrl,
				catSlug: "test-category",
			}),
		});

		expect(toast.success).toHaveBeenCalledWith(labels.writePost.postSavedSuccess);
		expect(mockPush).toHaveBeenCalledWith(routes.post("test-title", "test-category"));
	});

	// Test error handling
	it("should handle 401 error response", async () => {
		const mockResponse = {
			ok: false,
			status: 401,
			json: jest.fn().mockResolvedValue({}),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(toast.error).toHaveBeenCalledWith(labels.errors.unauthorized);
		expect(result.current.isSubmitting).toBe(false);
	});

	it("should handle 409 error response (title exists)", async () => {
		const mockResponse = {
			ok: false,
			status: 409,
			json: jest.fn().mockResolvedValue({}),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(toast.error).toHaveBeenCalledWith(labels.errors.postTitleExists);
		expect(result.current.isSubmitting).toBe(false);
	});

	it("should handle network error during submission", async () => {
		(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() => useCreatePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(toast.error).toHaveBeenCalledWith(labels.errors.savingPostFailed);
		expect(result.current.isSubmitting).toBe(false);
	});
});

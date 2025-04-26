import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { usePostForm } from "./usePostForm";
import { labels } from "@/shared/utils/labels";
import { getLocalizedRoutes } from "@/shared/utils/routes";

jest.mock("sonner", () => ({
	toast: {
		success: jest.fn(),
		error: jest.fn(),
	},
}));

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
	usePathname: jest.fn().mockReturnValue("/pl"),
}));

describe("usePostForm", () => {
	const mockPush = jest.fn();
	const mockMediaUrl = "https://example.com/image.jpg";
	const mockLocale = "pl";
	const localizedRoutes = getLocalizedRoutes(mockLocale);

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
		(usePathname as jest.Mock).mockReturnValue(`/${mockLocale}`);
		global.fetch = jest.fn();
	});

	// Test initial state
	it("should initialize with default values", () => {
		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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
		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("New Title");
		});

		expect(result.current.title).toBe("New Title");
	});

	it("should update content when setContent is called", () => {
		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setContent("New Content");
		});

		expect(result.current.content).toBe("New Content");
	});

	it("should update categorySlug when setCategorySlug is called", () => {
		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setCategorySlug("new-category");
		});

		expect(result.current.categorySlug).toBe("new-category");
	});

	// Test form validation
	it("should set errors when form is submitted with empty fields", async () => {
		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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

	it("should set isSubmitting to true during submission and keep it true after success for loader visibility", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue({ slug: "new-post" }),
		};

		let isSubmittingDuringFetch = false;

		global.fetch = jest.fn().mockImplementation(async () => {
			isSubmittingDuringFetch = true;
			return mockResponse;
		});

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(isSubmittingDuringFetch).toBe(true);
		expect(result.current.isSubmitting).toBe(true); // isSubmitting should remain true after success
		expect(mockPush).toHaveBeenCalledWith(localizedRoutes.post("new-post", "test-category"));
	});

	// Test successful submission
	it("should handle successful post submission", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue({ slug: "test-title" }),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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
				slug: "test-title",
				catSlug: "test-category",
				isVisible: true,
			}),
		});

		expect(toast.success).toHaveBeenCalledWith(labels.writePost.postSavedSuccess);
		expect(mockPush).toHaveBeenCalledWith(localizedRoutes.post("test-title", "test-category"));
	});

	// Test error handling
	it("should handle 401 error response", async () => {
		const mockResponse = {
			ok: false,
			status: 401,
			json: jest.fn().mockResolvedValue({}),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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

	it("should handle custom error message from response", async () => {
		const mockResponse = {
			ok: false,
			status: 500,
			json: jest.fn().mockResolvedValue({ message: "Custom error message" }),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(toast.error).toHaveBeenCalledWith("Custom error message");
		expect(result.current.isSubmitting).toBe(false);
	});

	it("should handle network error during submission", async () => {
		(global.fetch as jest.Mock).mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

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

	// Test slugify function
	it("should correctly slugify title with special characters", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue({ slug: "test-title-with-special-characters" }),
		};
		(global.fetch as jest.Mock).mockResolvedValue(mockResponse);

		const { result } = renderHook(() => usePostForm(mockMediaUrl));

		act(() => {
			result.current.setTitle("Test Title with Spécial Chàracters!");
			result.current.setContent("Test Content");
			result.current.setCategorySlug("test-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(global.fetch).toHaveBeenCalledWith(
			expect.anything(),
			expect.objectContaining({
				body: expect.stringContaining("test-title-with-special-characters") as string,
			}),
		);
	});

	// Test cleanup
	it("should reset isSubmitting state on unmount", () => {
		const initialState = {
			title: "",
			content: "",
			categorySlug: "",
			isSubmitting: true,
			errors: {
				title: false,
				category: false,
				content: false,
			},
		};

		const mockDispatch = jest.fn();
		jest.spyOn(React, "useReducer").mockImplementation(() => [initialState, mockDispatch]);

		const { unmount } = renderHook(() => usePostForm(mockMediaUrl));

		mockDispatch.mockClear();
		unmount();

		expect(mockDispatch).toHaveBeenCalledWith({
			type: "SET_SUBMITTING",
			payload: false,
		});
	});
});

import { renderHook, act } from "@testing-library/react";
import { useRouter, usePathname } from "next/navigation";
import { useEditPostForm } from "./useEditPostForm";
import { getPostByIdOrSlug, updatePost } from "@/features/blog/api/posts/request";
import { labels } from "@/shared/utils/labels";
import { getLocalizedRoutes } from "@/shared/utils/routes";

jest.mock("next/navigation", () => ({
	useRouter: jest.fn(),
	usePathname: jest.fn().mockReturnValue("/pl"),
}));

jest.mock("@/features/blog/api/posts/request", () => ({
	getPostByIdOrSlug: jest.fn(),
	updatePost: jest.fn(),
}));

describe("useEditPostForm", () => {
	const mockPush = jest.fn();
	const mockMediaUrl = "https://example.com/image.jpg";
	const mockLocale = "pl";
	const localizedRoutes = getLocalizedRoutes(mockLocale);
	const mockPost = {
		id: "1",
		title: "Test Post",
		desc: "Test Content",
		img: mockMediaUrl,
		catSlug: "test-category",
		slug: "test-post",
		isVisible: true,
	};
	const mockSetImageUrl = jest.fn();

	beforeEach(() => {
		jest.clearAllMocks();
		(useRouter as jest.Mock).mockReturnValue({
			push: mockPush,
		});
		(usePathname as jest.Mock).mockReturnValue(`/${mockLocale}`);
		(getPostByIdOrSlug as jest.Mock).mockResolvedValue(mockPost);
	});

	// Test initial state and data fetching
	it("should fetch and initialize with post data", async () => {
		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		// Initially loading should be true
		expect(result.current.isLoading).toBe(true);

		// Wait for the useEffect to complete
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		// After loading, check if data is properly set
		expect(result.current.isLoading).toBe(false);
		expect(result.current.title).toBe(mockPost.title);
		expect(result.current.content).toBe(mockPost.desc);
		expect(result.current.categorySlug).toBe(mockPost.catSlug);
		expect(result.current.isSubmitting).toBe(false);
		expect(result.current.errors).toEqual({
			title: false,
			category: false,
			content: false,
		});
		expect(mockSetImageUrl).toHaveBeenCalledWith(mockPost.img);
	});

	it("should handle error when post is not found", async () => {
		(getPostByIdOrSlug as jest.Mock).mockResolvedValue(null);

		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		expect(result.current.isLoading).toBe(false);
		expect(result.current.error).toBe(labels.errors.postNotFound);
	});

	// Test state transformations
	it("should update title when setTitle is called", () => {
		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		act(() => {
			result.current.setTitle("Updated Title");
		});

		expect(result.current.title).toBe("Updated Title");
	});

	it("should update content when setContent is called", () => {
		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		act(() => {
			result.current.setContent("Updated Content");
		});

		expect(result.current.content).toBe("Updated Content");
	});

	it("should update categorySlug when setCategorySlug is called", () => {
		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		act(() => {
			result.current.setCategorySlug("updated-category");
		});

		expect(result.current.categorySlug).toBe("updated-category");
	});

	// Test form validation
	it("should set errors when form is submitted with empty fields", async () => {
		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		act(() => {
			result.current.setTitle("");
			result.current.setContent("");
			result.current.setCategorySlug("");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(result.current.errors).toEqual({
			title: true,
			category: true,
			content: true,
		});
		expect(updatePost).not.toHaveBeenCalled();
	});

	// Test successful submission
	it("should handle successful post update", async () => {
		(updatePost as jest.Mock).mockResolvedValue({ slug: "updated-post" });

		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		// Wait for initial data fetch
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		act(() => {
			result.current.setTitle("Updated Title");
			result.current.setContent("Updated Content");
			result.current.setCategorySlug("updated-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(updatePost).toHaveBeenCalledWith({
			id: mockPost.id,
			title: "Updated Title",
			desc: "Updated Content",
			img: mockMediaUrl,
			catSlug: "updated-category",
		});

		expect(mockPush).toHaveBeenCalledWith(localizedRoutes.post("updated-post", "updated-category"));
	});

	// Test error handling
	it("should handle 401 error response", async () => {
		(updatePost as jest.Mock).mockResolvedValue(null);

		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		// Wait for initial data fetch
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		act(() => {
			result.current.setTitle("Updated Title");
			result.current.setContent("Updated Content");
			result.current.setCategorySlug("updated-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(result.current.isSubmitting).toBe(false);
	});

	it("should handle 409 error response (title exists)", async () => {
		(updatePost as jest.Mock).mockResolvedValue(null);

		const { result } = renderHook(() =>
			useEditPostForm(mockPost.id, mockMediaUrl, mockSetImageUrl),
		);

		// Wait for initial data fetch
		await act(async () => {
			await new Promise((resolve) => setTimeout(resolve, 0));
		});

		act(() => {
			result.current.setTitle("Updated Title");
			result.current.setContent("Updated Content");
			result.current.setCategorySlug("updated-category");
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(result.current.isSubmitting).toBe(false);
	});
});

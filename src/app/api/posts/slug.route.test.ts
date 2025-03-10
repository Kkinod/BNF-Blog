import { GET, POST, PUT, DELETE, PATCH, type Post } from "./[slug]/route";
// eslint-disable-next-line import/no-unresolved
import { prisma } from "@/shared/utils/connect";
// eslint-disable-next-line import/no-unresolved
import { labels } from "@/shared/utils/labels";

interface ErrorResponse {
	error: string;
}

type ApiResponse = Post | ErrorResponse | null;

type MockResponseInit = {
	status?: number;
	headers?: Headers;
};

type MockResponseType = {
	status: number;
	headers: Headers;
	ok: boolean;
	json: () => Promise<ApiResponse>;
};

jest.mock("next/server", () => ({
	NextResponse: {
		json: function MockNextResponseJson(
			body: ApiResponse,
			init?: MockResponseInit,
		): MockResponseType {
			const status = init?.status || 200;
			const headers = init?.headers || new Headers();

			return {
				status,
				headers,
				ok: status >= 200 && status < 300,
				json: async () => body,
			};
		},
	},
}));

jest.mock("@/shared/utils/connect", () => ({
	prisma: {
		post: {
			findUnique: jest.fn(),
			update: jest.fn(),
		},
	},
}));

jest.mock("@/shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Ooops! Something went wrong!",
			unauthorized: "Unauthorized!",
			postNotFound: "Post Not Found",
		},
	},
}));

describe("Single Post API Route", () => {
	let mockRequest: Request;
	const mockParams = { slug: "test-post" };
	// eslint-disable-next-line @typescript-eslint/unbound-method
	const postUpdateMock = prisma.post.update as jest.Mock;

	beforeEach(() => {
		jest.clearAllMocks();

		mockRequest = {
			url: "http://localhost:3000/api/posts/test-post",
		} as unknown as Request;
	});

	describe("GET Method", () => {
		it("returns a post when found", async () => {
			const mockPost = {
				id: "1",
				createdAt: new Date(),
				slug: "test-post",
				title: "Test Post",
				desc: "Test Description",
				img: "test.jpg",
				views: 0,
				catSlug: "test",
				userEmail: "test@example.com",
				isVisible: true,
				isPick: false,
				user: {
					id: "user1",
					name: "Test User",
					email: "test@example.com",
					emailVerified: null,
					image: null,
				},
			};

			(prisma.post.findUnique as jest.Mock).mockResolvedValue(mockPost);
			postUpdateMock.mockResolvedValue({ ...mockPost, views: 1 });

			const response = await GET(mockRequest, { params: mockParams });

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Post;
			expect(body).toEqual(mockPost);

			// Verify that views were incremented
			expect(postUpdateMock).toHaveBeenCalled();
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			const updateCall = postUpdateMock.mock.calls[0][0];
			expect(updateCall).toEqual({
				where: { slug: "test-post" },
				data: { views: { increment: 1 } },
			});
		});

		it("returns 404 when post not found", async () => {
			(prisma.post.findUnique as jest.Mock).mockResolvedValue(null);

			const response = await GET(mockRequest, { params: mockParams });

			expect(response.status).toBe(404);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.postNotFound,
			});
		});

		it("handles database errors gracefully", async () => {
			(prisma.post.findUnique as jest.Mock).mockRejectedValue(
				new Error("Database connection failed"),
			);

			const response = await GET(mockRequest, { params: mockParams });

			expect(response.status).toBe(503);
			if (typeof response.headers.get === "function") {
				expect(response.headers.get("Retry-After")).toBe("30");
			}

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});
	});

	describe("HTTP Methods", () => {
		it("denies POST method", async () => {
			const response = await POST();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PUT method", async () => {
			const response = await PUT();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies DELETE method", async () => {
			const response = await DELETE();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PATCH method", async () => {
			const response = await PATCH();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});
	});
});

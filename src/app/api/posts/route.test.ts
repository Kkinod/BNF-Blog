import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { GET, POST, PUT, DELETE, PATCH, type Posts, type PostRequestBody } from "./route";
import { prisma } from "@/shared/utils/connect";
import { labels } from "@/shared/utils/labels";
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";

interface ErrorResponse {
	error: string;
}

interface PostsResponse {
	posts: Posts[];
	count: number;
}

type ApiResponse = PostsResponse | Posts | ErrorResponse | null;

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

interface MockNextRequest {
	json: () => Promise<PostRequestBody>;
}

// Pojedynczy mock dla next/server
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
			findMany: jest.fn(),
			count: jest.fn(),
			create: jest.fn(),
		},
		$transaction: jest.fn(),
	},
}));

jest.mock("@/features/auth/utils/currentUser", () => ({
	currentUser: jest.fn(),
	currentRole: jest.fn(),
}));

jest.mock("@/shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Ooops! Something went wrong!",
			unauthorized: "Unauthorized!",
			invalidCredentials: "Invalid credentials",
			youDoNoteHavePermissionToViewThisContent: "You do not have permission",
			postTitleExists: "Post with this title already exists. Please choose a different title.",
		},
	},
}));

jest.mock("@/config/constants", () => ({
	POST_PER_PAGE: 10,
}));

describe("Posts API Route", () => {
	let mockRequest: Request;
	let mockNextRequest: MockNextRequest;

	beforeEach(() => {
		jest.clearAllMocks();

		mockRequest = {
			url: "http://localhost:3000/api/posts?page=1",
		} as unknown as Request;

		mockNextRequest = {
			json: jest.fn().mockResolvedValue({
				title: "Test Post",
				desc: "Test Description",
				img: "test.jpg",
				slug: "test-post",
				catSlug: "test",
				isVisible: true,
			}),
		};
	});

	describe("GET Method", () => {
		it("returns posts with pagination", async () => {
			const mockPosts = [
				{
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
				},
			];

			(prisma.$transaction as jest.Mock).mockResolvedValue([mockPosts, 1]);

			const response = await GET(mockRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as PostsResponse;
			expect(body).toEqual({
				posts: mockPosts,
				count: 1,
			});
		});

		it("handles database errors gracefully", async () => {
			(prisma.$transaction as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

			const response = await GET(mockRequest);

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

	describe("POST Method", () => {
		it("creates a post when authenticated as ADMIN", async () => {
			const mockUser = { email: "admin@example.com" };
			const mockPost = {
				id: "1",
				createdAt: new Date(),
				slug: "test-post",
				title: "Test Post",
				desc: "Test Description",
				img: "test.jpg",
				views: 0,
				catSlug: "test",
				userEmail: "admin@example.com",
				isVisible: true,
				isPick: false,
			};

			(currentUser as jest.Mock).mockResolvedValue(mockUser);
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(prisma.post.create as jest.Mock).mockResolvedValue(mockPost);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Posts;
			expect(body).toEqual(mockPost);
		});

		it("returns 401 when not authenticated", async () => {
			(currentUser as jest.Mock).mockResolvedValue(null);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(401);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.invalidCredentials,
			});
		});

		it("returns 403 when not ADMIN", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "user@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);

			const response = await POST(mockNextRequest as unknown as NextRequest);

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.youDoNoteHavePermissionToViewThisContent,
			});
		});
	});

	describe("HTTP Methods", () => {
		it("denies PUT method", async () => {
			const response = await PUT();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies DELETE method", async () => {
			const response = await DELETE();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PATCH method", async () => {
			const response = await PATCH();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, POST");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});
	});
});

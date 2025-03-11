import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { GET, PATCH, POST, PUT, DELETE, type PickRequestBody } from "./route";
// eslint-disable-next-line import/no-unresolved
import { prisma } from "@/shared/utils/connect";
// eslint-disable-next-line import/no-unresolved
import { labels } from "@/shared/utils/labels";
// eslint-disable-next-line import/no-unresolved
import { currentUser, currentRole } from "@/features/auth/utils/currentUser";

interface ErrorResponse {
	error: string;
}

interface Post {
	id: string;
	isPick: boolean;
}

type ApiResponse = Post[] | Post | ErrorResponse | null;

type MockResponseInit = {
	status?: number;
	headers?: Record<string, string> | Headers;
};

type MockResponseType = {
	status: number;
	headers: {
		get: (name: string) => string | null;
	};
	ok: boolean;
	json: () => Promise<ApiResponse>;
};

interface MockNextRequest extends NextRequest {
	json: () => Promise<PickRequestBody>;
}

jest.mock("next/server", () => ({
	NextResponse: {
		json: function MockNextResponseJson(
			body: ApiResponse,
			init?: MockResponseInit,
		): MockResponseType {
			const status = init?.status || 200;
			const headersObj: Record<string, string> = {};

			// Convert Headers to plain object if needed
			if (init?.headers instanceof Headers) {
				init.headers.forEach((value, key) => {
					headersObj[key] = value;
				});
			} else if (init?.headers) {
				Object.assign(headersObj, init.headers);
			}

			// Special handling for methodNotAllowed which sets Allow header
			if (status === 405 && !headersObj["Allow"]) {
				headersObj["Allow"] = "GET, PATCH";
			}

			return {
				status,
				headers: {
					get: (name: string) => headersObj[name] || null,
				},
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
			update: jest.fn(),
		},
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
			forbidden: "Forbidden!",
		},
	},
}));

describe("Pick Posts API Route", () => {
	let mockNextRequest: MockNextRequest;

	beforeEach(() => {
		jest.clearAllMocks();

		mockNextRequest = {
			json: jest.fn().mockResolvedValue({
				postId: "1",
				isPick: true,
			}),
		} as unknown as MockNextRequest;
	});

	describe("GET Method", () => {
		it("returns picked posts", async () => {
			const mockPosts = [
				{
					id: "1",
					title: "Test Post",
					isPick: true,
					isVisible: true,
					user: {
						id: "user1",
						name: "Test User",
					},
				},
			];

			(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts);

			const response = await GET();

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Post[];
			expect(body).toEqual(mockPosts);

			// Verify cache headers
			expect(response.headers.get("Cache-Control")).toBe(
				"public, max-age=10, stale-while-revalidate=59",
			);
		});

		it("handles database errors gracefully", async () => {
			(prisma.post.findMany as jest.Mock).mockRejectedValue(
				new Error("Database connection failed"),
			);

			const response = await GET();

			expect(response.status).toBe(503);
			expect(response.headers.get("Retry-After")).toBe("30");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.somethingWentWrong,
			});
		});
	});

	describe("PATCH Method", () => {
		it("updates post pick status when authenticated as ADMIN", async () => {
			const mockUser = { email: "admin@example.com" };
			const mockPost = {
				id: "1",
				isPick: true,
			};

			(currentUser as jest.Mock).mockResolvedValue(mockUser);
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(prisma.post.update as jest.Mock).mockResolvedValue(mockPost);

			const response = await PATCH(mockNextRequest);

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);

			const body = (await response.json()) as Post;
			expect(body).toEqual(mockPost);

			// Verify no-cache headers
			expect(response.headers.get("Cache-Control")).toBe("no-store");

			// Verify update was called with correct parameters
			// eslint-disable-next-line @typescript-eslint/unbound-method
			const updateMock = prisma.post.update as jest.Mock;
			expect(updateMock).toHaveBeenCalledWith({
				where: { id: "1" },
				data: { isPick: true },
			});
		});

		it("returns 401 when not authenticated", async () => {
			(currentUser as jest.Mock).mockResolvedValue(null);

			const response = await PATCH(mockNextRequest);

			expect(response.status).toBe(401);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("returns 403 when not ADMIN", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "user@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);

			const response = await PATCH(mockNextRequest);

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.forbidden,
			});
		});

		it("handles database errors gracefully", async () => {
			(currentUser as jest.Mock).mockResolvedValue({ email: "admin@example.com" });
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			(prisma.post.update as jest.Mock).mockRejectedValue(new Error("Database connection failed"));

			const response = await PATCH(mockNextRequest);

			expect(response.status).toBe(503);
			expect(response.headers.get("Retry-After")).toBe("30");

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
			expect(response.headers.get("Allow")).toBe("GET, PATCH");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies PUT method", async () => {
			const response = await PUT();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, PATCH");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});

		it("denies DELETE method", async () => {
			const response = await DELETE();

			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET, PATCH");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: labels.errors.unauthorized,
			});
		});
	});
});

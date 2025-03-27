import type { NextRequest } from "next/server";
import { UserRole } from "@prisma/client";
import { GET, POST, PUT, PATCH, DELETE } from "./route";
import { prisma } from "@/shared/utils/connect";
import * as currentUserModule from "@/features/auth/utils/currentUser";

interface ErrorResponse {
	error: string;
}

interface Post {
	id: string;
	title: string;
	createdAt: Date;
	updatedAt: Date | null;
	slug: string;
	img: string | null;
	views: number;
	isVisible: boolean;
	isPick: boolean;
	catSlug: string;
	userEmail: string;
	user: {
		id: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

type ApiResponse = { posts: Post[]; count: number } | ErrorResponse;

jest.mock("@/shared/utils/connect", () => ({
	prisma: {
		$transaction: jest.fn(),
		post: {
			findMany: jest.fn(),
			count: jest.fn(),
		},
	},
}));

jest.mock("@/features/auth/utils/currentUser", () => ({
	currentUser: jest.fn().mockResolvedValue(null),
	currentRole: jest.fn().mockResolvedValue(null),
}));

jest.mock("next/server", () => {
	return {
		NextResponse: {
			json: jest
				.fn()
				.mockImplementation(
					(data: ApiResponse, init?: { status?: number; headers?: Record<string, string> }) => {
						const status = init?.status || 200;
						const headers = new Map<string, string>();

						if (init?.headers) {
							Object.entries(init.headers).forEach(([key, value]) => {
								headers.set(key, value);
							});
						}

						if (status === 405) {
							headers.set("Allow", "GET");
						}

						if (status === 200 && !headers.has("Cache-Control")) {
							headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=30");
						}

						return {
							status,
							headers: {
								get: (name: string): string | null => headers.get(name) || null,
							},
							ok: status >= 200 && status < 300,
							json: (): Promise<ApiResponse> => Promise.resolve(data),
						};
					},
				),
		},
	};
});

describe("Search API", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("GET method", () => {
		it("should return empty results for no matches", async () => {
			const emptyResult: [Post[], number] = [[], 0];
			(prisma.$transaction as jest.Mock).mockResolvedValueOnce(emptyResult);

			const req = {
				url: "http://localhost:3000/api/posts/search?query=",
			} as unknown as NextRequest;

			const response = await GET(req);
			const data = (await response.json()) as { posts: Post[]; count: number };

			expect(response.status).toBe(200);
			expect(data).toEqual({ posts: [], count: 0 });
			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should return filtered results based on search query", async () => {
			const mockPost: Post = {
				id: "1",
				title: "Test Post",
				createdAt: new Date(),
				updatedAt: new Date(),
				slug: "test-post",
				img: "test.jpg",
				views: 10,
				isVisible: true,
				isPick: false,
				catSlug: "test",
				userEmail: "test@example.com",
				user: {
					id: "user1",
					name: "Test User",
					email: "test@example.com",
					image: null,
				},
			};

			const mockResult: [Post[], number] = [[mockPost], 1];
			(prisma.$transaction as jest.Mock).mockResolvedValueOnce(mockResult);

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test",
			} as unknown as NextRequest;

			const response = await GET(req);
			const data = (await response.json()) as { posts: Post[]; count: number };

			expect(response.status).toBe(200);
			expect(data).toEqual({ posts: [mockPost], count: 1 });
			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should filter posts by category when category parameter is provided", async () => {
			(prisma.$transaction as jest.Mock).mockImplementation((queries) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const whereClause = queries[0].where;
				expect(whereClause).toBeDefined();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.catSlug).toBe("coding");
				return Promise.resolve([[], 0]);
			});

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test&category=coding",
			} as unknown as NextRequest;

			await GET(req);

			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should not filter by category when category parameter is not provided", async () => {
			(prisma.$transaction as jest.Mock).mockImplementation((queries) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const whereClause = queries[0].where;
				expect(whereClause).toBeDefined();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.catSlug).toBeUndefined();
				return Promise.resolve([[], 0]);
			});

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test",
			} as unknown as NextRequest;

			await GET(req);

			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should include hidden posts for admin users", async () => {
			jest.spyOn(currentUserModule, "currentRole").mockResolvedValueOnce(UserRole.ADMIN);

			(prisma.$transaction as jest.Mock).mockImplementation((queries) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const whereClause = queries[0].where;
				expect(whereClause).toBeDefined();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.isVisible).toBeUndefined();
				return Promise.resolve([[], 0]);
			});

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test",
			} as unknown as NextRequest;

			await GET(req);

			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should exclude hidden posts for non-admin users", async () => {
			jest.spyOn(currentUserModule, "currentRole").mockResolvedValueOnce(UserRole.USER);

			(prisma.$transaction as jest.Mock).mockImplementation((queries) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const whereClause = queries[0].where;
				expect(whereClause).toBeDefined();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.isVisible).toBe(true);
				return Promise.resolve([[], 0]);
			});

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test",
			} as unknown as NextRequest;

			await GET(req);

			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should filter by both category and visibility for non-admin users", async () => {
			jest.spyOn(currentUserModule, "currentRole").mockResolvedValueOnce(UserRole.USER);

			(prisma.$transaction as jest.Mock).mockImplementation((queries) => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				const whereClause = queries[0].where;
				expect(whereClause).toBeDefined();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.catSlug).toBe("coding");
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				expect(whereClause.isVisible).toBe(true);
				return Promise.resolve([[], 0]);
			});

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test&category=coding",
			} as unknown as NextRequest;

			await GET(req);

			expect((prisma.$transaction as jest.Mock).mock.calls.length).toBe(1);
		});

		it("should set appropriate cache control headers", async () => {
			(prisma.$transaction as jest.Mock).mockResolvedValueOnce([[], 0]);

			const req = {
				url: "http://localhost:3000/api/posts/search?query=Test",
			} as unknown as NextRequest;

			const response = await GET(req);

			expect(response.headers.get("Cache-Control")).toBe(
				"public, max-age=60, stale-while-revalidate=30",
			);
		});
	});

	describe("Disallowed HTTP methods", () => {
		it("should reject POST requests", async () => {
			const response = await POST();
			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");
		});

		it("should reject PUT requests", async () => {
			const response = await PUT();
			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");
		});

		it("should reject PATCH requests", async () => {
			const response = await PATCH();
			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");
		});

		it("should reject DELETE requests", async () => {
			const response = await DELETE();
			expect(response.status).toBe(405);
			expect(response.headers.get("Allow")).toBe("GET");
		});
	});
});

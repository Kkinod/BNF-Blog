// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { GET } from "./route";
// eslint-disable-next-line import/no-unresolved
import { currentRole } from "@/features/auth/utils/currentUser";

// Type definitions
interface ErrorResponse {
	error: string;
	message: string;
}

type MockResponseInit = {
	status?: number;
	headers?: Headers;
};

type MockResponseType = {
	status: number;
	headers: Headers;
	ok: boolean;
	json: () => Promise<ErrorResponse | null>;
};

// Setup mocks first
jest.mock("next/server", () => ({
	NextResponse: function MockNextResponse(
		body: string | null,
		init?: MockResponseInit,
	): MockResponseType {
		const status = init?.status || 200;
		const headers = init?.headers || new Headers();

		return {
			status,
			headers,
			ok: status >= 200 && status < 300,
			json: async () => (body ? (JSON.parse(body) as ErrorResponse) : null),
		};
	},
}));

jest.mock("@/features/auth/utils/currentUser", () => ({
	currentRole: jest.fn(),
}));

// Then define request mock
class MockRequest implements Request {
	public headers: Headers;
	public method: string;
	public url = "http://localhost:3000";
	public body: ReadableStream | null = null;
	public bodyUsed = false;
	public cache = "default" as RequestCache;
	public credentials = "same-origin" as RequestCredentials;
	public destination = "" as RequestDestination;
	public integrity = "";
	public keepalive = false;
	public mode = "cors" as RequestMode;
	public redirect = "follow" as RequestRedirect;
	public referrer = "";
	public referrerPolicy = "no-referrer" as ReferrerPolicy;
	public signal = new AbortController().signal;

	constructor(method: string = "GET", headers: Record<string, string> = {}) {
		this.method = method;
		this.headers = new Headers(headers);
	}

	// Stub methods
	arrayBuffer(): Promise<ArrayBuffer> {
		return Promise.reject("Not implemented");
	}
	blob(): Promise<Blob> {
		return Promise.reject("Not implemented");
	}
	clone(): Request {
		return this;
	}
	formData(): Promise<FormData> {
		return Promise.reject("Not implemented");
	}
	json(): Promise<unknown> {
		return Promise.reject("Not implemented");
	}
	text(): Promise<string> {
		return Promise.reject("Not implemented");
	}
	bytes(): Promise<Uint8Array> {
		return Promise.reject("Not implemented");
	}
}

describe("Admin API Route", () => {
	const createRequest = (method: string = "GET", headers: Record<string, string> = {}) => {
		return new MockRequest(method, headers);
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("Authorization", () => {
		it("allows ADMIN access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			const response = await GET(createRequest());

			expect(response.status).toBe(200);
			expect(response.ok).toBe(true);
		});

		it("denies USER access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);
			const response = await GET(createRequest());

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);
		});

		it("denies unauthenticated access", async () => {
			(currentRole as jest.Mock).mockResolvedValue(undefined);
			const response = await GET(createRequest());

			expect(response.status).toBe(403);
			expect(response.ok).toBe(false);
		});
	});

	describe("HTTP Methods", () => {
		it.each(["POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"])(
			"denies %s method",
			async (method) => {
				const response = await GET(createRequest(method));

				expect(response.status).toBe(405);
				expect(response.headers.get("Allow")).toBe("GET");
			},
		);
	});

	describe("Security Headers", () => {
		it("sets appropriate security headers", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			const response = await GET(createRequest());

			// Verify security headers
			expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff");
			expect(response.headers.get("X-Frame-Options")).toBe("DENY");
			expect(response.headers.get("Content-Security-Policy")).toBeDefined();
			expect(response.headers.get("Strict-Transport-Security")).toBeDefined();
		});

		it("implements CORS properly", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			const response = await GET(
				createRequest("GET", {
					Origin: "https://trusted-origin.com",
				}),
			);

			expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
				"https://trusted-origin.com",
			);
			expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET");
			expect(response.headers.get("Access-Control-Allow-Headers")).toBeDefined();
		});

		it("handles preflight requests correctly", async () => {
			const response = await GET(
				createRequest("OPTIONS", {
					Origin: "https://trusted-origin.com",
					"Access-Control-Request-Method": "GET",
				}),
			);

			expect(response.status).toBe(204);
			expect(response.headers.get("Access-Control-Allow-Methods")).toBe("GET");
		});
	});

	describe("Error Handling", () => {
		it("handles database errors gracefully", async () => {
			(currentRole as jest.Mock).mockRejectedValue(new Error("Database connection failed"));
			const response = await GET(createRequest());

			expect(response.status).toBe(503);
			expect(response.headers.get("Retry-After")).toBeDefined();
		});

		it("returns appropriate error format", async () => {
			(currentRole as jest.Mock).mockRejectedValue(new Error("Unexpected error"));
			const response = await GET(createRequest());

			expect(response.status).toBe(500);
			expect(response.headers.get("Content-Type")).toBe("application/json");

			const body = (await response.json()) as ErrorResponse;
			expect(body).toEqual({
				error: "Internal Server Error",
				message: "An unexpected error occurred",
			});
		});
	});

	describe("Caching", () => {
		it("sets appropriate cache headers for successful responses", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.ADMIN);
			const response = await GET(createRequest());

			expect(response.headers.get("Cache-Control")).toBe("no-store, must-revalidate");
			expect(response.headers.get("Pragma")).toBe("no-cache");
		});

		it("sets appropriate cache headers for error responses", async () => {
			(currentRole as jest.Mock).mockResolvedValue(UserRole.USER);
			const response = await GET(createRequest());

			expect(response.headers.get("Cache-Control")).toBe("no-store");
			expect(response.headers.get("Pragma")).toBe("no-cache");
		});
	});
});

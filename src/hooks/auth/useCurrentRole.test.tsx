import { renderHook } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useCurrentRole } from "./useCurrentRole";

jest.mock("next-auth/react", () => ({
	useSession: jest.fn(),
}));

describe("useCurrentRole", () => {
	// Test when user has a role
	it("should return the user's role when available", () => {
		// Setup mock to return a session with a user role
		(useSession as jest.Mock).mockReturnValue({
			data: {
				user: {
					role: "ADMIN",
				},
			},
		});

		const { result } = renderHook(() => useCurrentRole());

		expect(result.current).toBe("ADMIN");
	});

	// Test when user has no role
	it("should return undefined when user has no role", () => {
		// Setup mock to return a session with a user but no role
		(useSession as jest.Mock).mockReturnValue({
			data: {
				user: {},
			},
		});

		const { result } = renderHook(() => useCurrentRole());

		expect(result.current).toBeUndefined();
	});

	// Test when there is no user
	it("should return undefined when there is no user", () => {
		// Setup mock to return a session with no user
		(useSession as jest.Mock).mockReturnValue({
			data: {},
		});

		const { result } = renderHook(() => useCurrentRole());

		expect(result.current).toBeUndefined();
	});

	// Test when there is no session data
	it("should return undefined when there is no session data", () => {
		// Setup mock to return no session data
		(useSession as jest.Mock).mockReturnValue({
			data: null,
		});

		const { result } = renderHook(() => useCurrentRole());

		expect(result.current).toBeUndefined();
	});
});

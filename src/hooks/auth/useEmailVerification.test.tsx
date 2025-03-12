import { renderHook, act } from "@testing-library/react";
import { toast } from "sonner";
import { resendVerificationEmail } from "../../../actions/resend-verification";
import { useEmailVerification } from "./useEmailVerification";

jest.mock("sonner", () => ({
	toast: {
		error: jest.fn(),
		success: jest.fn(),
		info: jest.fn(),
	},
}));

jest.mock("../../../actions/resend-verification", () => ({
	resendVerificationEmail: jest.fn(),
}));

jest.mock("../../shared/utils/labels", () => ({
	labels: {
		errors: {
			somethingWentWrong: "Something went wrong",
			resendVerificationRateLimitExceeded: "Please wait {time} before trying again",
		},
	},
}));

jest.mock("./useTimeCounter", () => ({
	useTimeCounter: () => ({
		timeRemaining: 0,
		formatTime: (seconds: number) => `${Math.floor(seconds / 60)}:${seconds % 60}`,
		start: jest.fn(() => {}),
	}),
}));

describe("useEmailVerification", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("should initialize with default values", () => {
		const { result } = renderHook(() => useEmailVerification());

		expect(result.current.verificationEmail).toBe("");
		expect(result.current.showVerification).toBe(false);
		expect(result.current.isResendDisabled).toBe(false);
	});

	it("should start verification with email", () => {
		const { result } = renderHook(() => useEmailVerification());

		act(() => {
			result.current.startVerification("test@example.com");
		});

		expect(result.current.verificationEmail).toBe("test@example.com");
		expect(result.current.showVerification).toBe(true);
	});

	it("should start verification with wait time", () => {
		const { result } = renderHook(() => useEmailVerification());

		act(() => {
			result.current.startVerification("test@example.com", 60);
		});

		expect(result.current.verificationEmail).toBe("test@example.com");
		expect(result.current.showVerification).toBe(true);
		expect(result.current.isResendDisabled).toBe(true);
		expect(toast.info).toHaveBeenCalledWith("Please wait 1:0 before trying again");
	});

	it("should handle resend verification success", async () => {
		(resendVerificationEmail as jest.Mock).mockResolvedValue({ success: "Email sent" });

		const { result } = renderHook(() => useEmailVerification());

		act(() => {
			result.current.setVerificationEmail("test@example.com");
		});

		await act(async () => {
			result.current.handleResendVerification();
		});

		expect(resendVerificationEmail).toHaveBeenCalledWith("test@example.com");
		expect(toast.success).toHaveBeenCalledWith("Email sent");
	});

	it("should handle resend verification error from API", async () => {
		(resendVerificationEmail as jest.Mock).mockResolvedValue({ error: "API Error" });

		const { result } = renderHook(() => useEmailVerification());

		act(() => {
			result.current.setVerificationEmail("test@example.com");
		});

		await act(async () => {
			result.current.handleResendVerification();
		});

		expect(resendVerificationEmail).toHaveBeenCalledWith("test@example.com");
		expect(toast.error).toHaveBeenCalledWith("API Error");
	});

	it("should handle resend verification exception", async () => {
		(resendVerificationEmail as jest.Mock).mockRejectedValue(new Error("Network error"));

		const { result } = renderHook(() => useEmailVerification());

		act(() => {
			result.current.setVerificationEmail("test@example.com");
		});

		await act(async () => {
			result.current.handleResendVerification();
		});

		expect(resendVerificationEmail).toHaveBeenCalledWith("test@example.com");
		expect(toast.error).toHaveBeenCalledWith("Something went wrong");
	});

	it("should not resend verification if email is empty", async () => {
		const { result } = renderHook(() => useEmailVerification());

		await act(async () => {
			result.current.handleResendVerification();
		});

		expect(resendVerificationEmail).not.toHaveBeenCalled();
	});
});

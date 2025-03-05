import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { toast } from "sonner";
import * as resetAction from "../../../../../actions/reset";
import { labels } from "../../../../shared/utils/labels";
import { ResetPageView } from "./ResetPageView";

jest.mock("sonner");
jest.mock("../../../../../actions/reset");

type Labels = typeof labels;
type LabelErrors = Labels["errors"];

type ResetSuccess = {
	success: Labels["resetEmailSend"];
	error?: undefined;
	status?: undefined;
	waitTimeSeconds?: undefined;
};

type ResetInvalidEmailError = {
	error: LabelErrors["invalidEmail"];
	status?: undefined;
	waitTimeSeconds?: undefined;
	success?: undefined;
};

type ResetEmailNotFoundError = {
	error: LabelErrors["emailNotFound"];
	status?: undefined;
	waitTimeSeconds?: undefined;
	success?: undefined;
};

type ResetRateLimitError = {
	error: string;
	status: number;
	waitTimeSeconds: number;
	success?: undefined;
};

type _ResetResponse =
	| ResetSuccess
	| ResetInvalidEmailError
	| ResetEmailNotFoundError
	| ResetRateLimitError;

describe("ResetPageView Component", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("renders the reset password form", () => {
		render(<ResetPageView />);

		const forgotPasswordText = labels.forgotYourPassword;
		const resetPasswordText = labels.resetPassword;
		const emailText = labels.email;
		const sendResetEmailText = labels.sendResetEmail;
		const backToLoginText = labels.backToLogin;

		expect(screen.getByText(forgotPasswordText)).toBeInTheDocument();
		expect(screen.getByText(resetPasswordText)).toBeInTheDocument();
		expect(screen.getByLabelText(emailText)).toBeInTheDocument();
		expect(screen.getByPlaceholderText("example@example.com")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: sendResetEmailText })).toBeInTheDocument();
		expect(screen.getByText(backToLoginText)).toBeInTheDocument();
	});

	it("submits the form with valid email", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			success: labels.resetEmailSend,
		} as ResetSuccess);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "test@example.com" });
			expect(screen.getByText(labels.resetEmailSend)).toBeInTheDocument();
		});
	});

	it("shows error message when reset fails", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			error: labels.errors.emailNotFound,
		} as ResetEmailNotFoundError);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "nonexistent@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "nonexistent@example.com" });
			expect(screen.getByText(labels.errors.emailNotFound)).toBeInTheDocument();
		});
	});

	it("shows toast error when rate limit is exceeded", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			error: "Too many requests",
			status: 429,
			waitTimeSeconds: 60,
		} as ResetRateLimitError);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "test@example.com" });
			expect(toast.error).toHaveBeenCalledWith("Too many requests");
		});
	});

	it("disables form elements during submission", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			success: labels.resetEmailSend,
		} as ResetSuccess);

		const { container } = render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const form = container.querySelector("form");

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		if (form) fireEvent.submit(form);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "test@example.com" });
		});

		await waitFor(() => {
			const successDiv = container.querySelector(".bg-emerald-500\\/15");
			expect(successDiv).toBeInTheDocument();
		});
	});

	it("clears form after successful submission", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			success: labels.resetEmailSend,
		} as ResetSuccess);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		expect(emailInput).toHaveValue("test@example.com");

		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "test@example.com" });
			expect(screen.getByText(labels.resetEmailSend)).toBeInTheDocument();
			expect(emailInput).toHaveValue("");
		});
	});

	it("validates email format", async () => {
		const mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			success: labels.resetEmailSend,
		} as ResetSuccess);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "invalid-email" } });
		fireEvent.click(submitButton);

		await new Promise((resolve) => setTimeout(resolve, 100));
		expect(mockReset).not.toHaveBeenCalled();

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(mockReset).toHaveBeenCalledWith({ email: "test@example.com" });
		});
	});

	it("submits form on Enter key press", async () => {
		const _mockReset = jest.spyOn(resetAction, "reset").mockResolvedValue({
			success: labels.resetEmailSend,
		} as ResetSuccess);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			const successMessage = screen.getByText(labels.resetEmailSend);
			expect(successMessage).toBeInTheDocument();
		});
	});

	it("clears error and success messages on new submission", async () => {
		const _mockReset = jest
			.spyOn(resetAction, "reset")
			.mockResolvedValueOnce({
				error: labels.errors.emailNotFound,
			} as ResetEmailNotFoundError)
			.mockResolvedValueOnce({
				success: labels.resetEmailSend,
			} as ResetSuccess);

		render(<ResetPageView />);

		const emailInput = screen.getByLabelText(labels.email);
		const submitButton = screen.getByRole("button", { name: labels.sendResetEmail });

		fireEvent.change(emailInput, { target: { value: "nonexistent@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(labels.errors.emailNotFound)).toBeInTheDocument();
		});

		fireEvent.change(emailInput, { target: { value: "test@example.com" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText(labels.errors.emailNotFound)).not.toBeInTheDocument();
			expect(screen.getByText(labels.resetEmailSend)).toBeInTheDocument();
		});
	});
});

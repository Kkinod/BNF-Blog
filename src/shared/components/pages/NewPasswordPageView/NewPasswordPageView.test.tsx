import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSearchParams, useRouter } from "next/navigation";
import * as newPasswordAction from "../../../../../actions/new-password";
import { labels } from "../../../../shared/utils/labels";
import { NewPasswordPageView } from "./NewPasswordPageView";
import * as passwordSecurityHook from "@/hooks/usePasswordSecurity";
import * as debouncedValueHook from "@/hooks/useDebouncedValue";

jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
	useRouter: jest.fn(),
}));

jest.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt }: { src: string; alt: string }) => (
		<div data-testid="image" data-src={src} data-alt={alt} />
	),
}));

jest.mock("@/hooks/usePasswordSecurity", () => ({
	usePasswordSecurity: jest.fn(),
}));

jest.mock("@/hooks/useDebouncedValue", () => ({
	useDebouncedValue: jest.fn(),
}));

jest.mock("../../../../../actions/new-password");

type NewPasswordSuccess = {
	success: string;
	error?: undefined;
};

type NewPasswordError = {
	error: string;
	success?: undefined;
};

type _NewPasswordResponse = NewPasswordSuccess | NewPasswordError;

describe("NewPasswordPageView Component", () => {
	const mockToken = "valid-token";
	const mockSuccess = labels.passwordUpdated;
	const mockError = "Invalid token";
	const validPassword = "newPassword123";
	const mockRouter = { push: jest.fn() };

	beforeEach(() => {
		jest.clearAllMocks();
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue(mockToken),
		});
		(useRouter as jest.Mock).mockReturnValue(mockRouter);
		(debouncedValueHook.useDebouncedValue as jest.Mock).mockImplementation(
			(value: string) => value,
		);
		(passwordSecurityHook.usePasswordSecurity as jest.Mock).mockReturnValue({
			isCheckingPassword: false,
			isPasswordCompromised: false,
			isSecurityCheckPassed: true,
			renderPasswordMessage: () => null,
		});
	});

	it("renders new password form", () => {
		render(<NewPasswordPageView />);

		expect(screen.getByText(labels.enterANewPassword)).toBeInTheDocument();
		expect(screen.getByText(labels.newPassword)).toBeInTheDocument();
		expect(screen.getByLabelText(labels.password)).toBeInTheDocument();
		expect(screen.getByRole("button", { name: labels.resetPassword })).toBeInTheDocument();
		expect(screen.getByText(labels.backToLogin)).toBeInTheDocument();
	});

	it("submits form with valid password", async () => {
		(newPasswordAction.newPassword as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		} as NewPasswordSuccess);

		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const confirmPasswordInput = screen.getByLabelText(labels.confirmPassword);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.change(confirmPasswordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});

		expect(newPasswordAction.newPassword).toHaveBeenCalledWith(
			{ password: validPassword, confirmPassword: validPassword },
			mockToken,
		);
	});

	it("displays error message on invalid token", async () => {
		(newPasswordAction.newPassword as jest.Mock).mockResolvedValue({
			error: mockError,
		} as NewPasswordError);

		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const confirmPasswordInput = screen.getByLabelText(labels.confirmPassword);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.change(confirmPasswordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockError)).toBeInTheDocument();
		});
	});

	it("validates required password field", async () => {
		render(<NewPasswordPageView />);

		const submitButton = screen.getByRole("button", { name: labels.resetPassword });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("Mininium 8 characters required")).toBeInTheDocument();
		});

		expect(newPasswordAction.newPassword).not.toHaveBeenCalled();
	});

	it("validates minimum password length", async () => {
		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: "short" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText("Mininium 8 characters required")).toBeInTheDocument();
		});

		expect(newPasswordAction.newPassword).not.toHaveBeenCalled();
	});

	it("clears error and success messages on new submission", async () => {
		(newPasswordAction.newPassword as jest.Mock)
			.mockResolvedValueOnce({
				error: mockError,
			} as NewPasswordError)
			.mockResolvedValueOnce({
				success: mockSuccess,
			} as NewPasswordSuccess);

		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const confirmPasswordInput = screen.getByLabelText(labels.confirmPassword);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.change(confirmPasswordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockError)).toBeInTheDocument();
		});

		fireEvent.change(passwordInput, { target: { value: validPassword + "1" } });
		fireEvent.change(confirmPasswordInput, { target: { value: validPassword + "1" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText(mockError)).not.toBeInTheDocument();
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});
	});

	it("redirects to login page after successful password reset", async () => {
		jest.useFakeTimers();
		(newPasswordAction.newPassword as jest.Mock).mockResolvedValue({
			success: mockSuccess,
		} as NewPasswordSuccess);

		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const confirmPasswordInput = screen.getByLabelText(labels.confirmPassword);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.change(confirmPasswordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});

		jest.advanceTimersByTime(2000);

		expect(mockRouter.push).toHaveBeenCalledWith(expect.stringContaining("/login"));

		jest.useRealTimers();
	});

	it("disables submit button when password security is checking", async () => {
		(passwordSecurityHook.usePasswordSecurity as jest.Mock).mockReturnValue({
			isCheckingPassword: true,
			isPasswordCompromised: false,
			isSecurityCheckPassed: false,
			renderPasswordMessage: () => null,
		});

		render(<NewPasswordPageView />);

		const submitButton = screen.getByRole("button", { name: labels.resetPassword });
		expect(submitButton).toBeDisabled();
	});
});

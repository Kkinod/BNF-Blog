import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useSearchParams } from "next/navigation";
import * as newPasswordAction from "../../../../../actions/new-password";
import { labels } from "../../../../shared/utils/labels";
import { NewPasswordPageView } from "./NewPasswordPageView";

jest.mock("next/navigation", () => ({
	useSearchParams: jest.fn(),
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

	beforeEach(() => {
		jest.clearAllMocks();
		(useSearchParams as jest.Mock).mockReturnValue({
			get: jest.fn().mockReturnValue(mockToken),
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
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});

		expect(newPasswordAction.newPassword).toHaveBeenCalledWith(
			{ password: validPassword },
			mockToken,
		);
	});

	it("displays error message on invalid token", async () => {
		(newPasswordAction.newPassword as jest.Mock).mockResolvedValue({
			error: mockError,
		} as NewPasswordError);

		render(<NewPasswordPageView />);

		const passwordInput = screen.getByLabelText(labels.password);
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
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
			expect(screen.getByText(labels.errors.min6CharactersRequired)).toBeInTheDocument();
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
			expect(screen.getByText(labels.errors.min6CharactersRequired)).toBeInTheDocument();
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
		const submitButton = screen.getByRole("button", { name: labels.resetPassword });

		fireEvent.change(passwordInput, { target: { value: validPassword } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.getByText(mockError)).toBeInTheDocument();
		});

		fireEvent.change(passwordInput, { target: { value: validPassword + "1" } });
		fireEvent.click(submitButton);

		await waitFor(() => {
			expect(screen.queryByText(mockError)).not.toBeInTheDocument();
			expect(screen.getByText(mockSuccess)).toBeInTheDocument();
		});
	});
});

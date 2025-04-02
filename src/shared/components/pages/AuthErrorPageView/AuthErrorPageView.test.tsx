import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { labels } from "../../../../shared/utils/labels";
import { AuthErrorPageView } from "./AuthErrorPageView";

jest.mock("@radix-ui/react-icons", () => ({
	ExclamationTriangleIcon: () => <div data-testid="error-icon" />,
}));

describe("AuthErrorPageView", () => {
	it("renderuje komponent z odpowiednimi nagłówkami", () => {
		render(<AuthErrorPageView />);

		expect(screen.getByText(labels.errors.somethingWentWrong)).toBeInTheDocument();
		expect(screen.getByText(labels.errors.error)).toBeInTheDocument();
		expect(screen.getByText(labels.backToLogin)).toBeInTheDocument();
	});

	it("wyświetla ikonę błędu", () => {
		render(<AuthErrorPageView />);

		expect(screen.getByTestId("error-icon")).toBeInTheDocument();
	});

	it("zawiera link powrotu do strony logowania", () => {
		render(<AuthErrorPageView />);

		const backLink = screen.getByRole("link", { name: labels.backToLogin });
		expect(backLink).toHaveAttribute("href", "/login");
	});

	it("ma odpowiednią strukturę i style", () => {
		const { container } = render(<AuthErrorPageView />);

		expect(container.firstChild).toHaveClass("flex justify-center");

		const iconContainer = screen.getByTestId("error-icon").parentElement;
		expect(iconContainer).toHaveClass("flex w-full items-center justify-center");
	});
});

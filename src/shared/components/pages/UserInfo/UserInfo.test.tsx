import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UserRole } from "@prisma/client";
import { labels } from "../../../../shared/utils/labels";
import { UserInfo } from "./UserInfo";

jest.mock("@/shared/components/ui/badge", () => ({
	Badge: ({ children, variant }: { children: React.ReactNode; variant: string }) => (
		<div data-testid="badge" data-variant={variant}>
			{children}
		</div>
	),
}));

jest.mock("next/image", () => ({
	__esModule: true,
	default: ({ src, alt }: { src: string; alt: string }) => (
		<div data-testid="image" data-src={src} data-alt={alt} />
	),
}));

jest.mock("@/shared/components/ui/avatar", () => ({
	Avatar: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="avatar" className={className}>
			{children}
		</div>
	),
	AvatarImage: ({ src, alt }: { src: string; alt: string }) => (
		<div data-testid="avatar-image" data-src={src} data-alt={alt} />
	),
	AvatarFallback: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="avatar-fallback" className={className}>
			{children}
		</div>
	),
}));

describe("UserInfo Component", () => {
	const mockUser = {
		id: "user-123",
		name: "John Doe",
		email: "john.doe@example.com",
		role: UserRole.ADMIN,
		isTwoFactorEnabled: true,
		isOAuth: false,
		image: null,
		emailVerified: new Date(),
	};

	afterEach(cleanup);

	it("renders the component with user information", () => {
		render(<UserInfo user={mockUser} />);

		const nameHeader = screen.getByRole("heading", { level: 2 });
		expect(nameHeader).toHaveTextContent("John Doe");
		const emailElements = screen.getAllByText("john.doe@example.com");
		expect(emailElements.length).toBeGreaterThan(0);
	});

	it("displays all user information fields correctly", () => {
		render(<UserInfo user={mockUser} />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		expect(screen.getByText("user-123")).toBeInTheDocument();
		const nameHeader = screen.getByRole("heading", { level: 2 });
		expect(nameHeader).toHaveTextContent("John Doe");
		const emailElements = screen.getAllByText("john.doe@example.com");
		expect(emailElements.length).toBeGreaterThan(0);
		expect(screen.getAllByText(UserRole.ADMIN)).toHaveLength(2);
		expect(screen.getByText(labels.enabled)).toBeInTheDocument();
	});

	it("handles undefined user data gracefully", () => {
		render(<UserInfo />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		const dashValues = screen.getAllByText("-");
		expect(dashValues.length).toBeGreaterThan(0);
		const nameHeader = screen.getByRole("heading", { level: 2 });
		expect(nameHeader).toHaveTextContent("User");
		expect(screen.getByText(labels.disabled)).toBeInTheDocument();
	});

	it("displays enabled status for two factor authentication when enabled", () => {
		render(<UserInfo user={mockUser} />);

		expect(screen.getByText(labels.enabled)).toBeInTheDocument();
		const checkIcon = screen.getByText(labels.enabled).previousSibling;
		expect(checkIcon).toBeInTheDocument();
	});

	it("displays disabled status for two factor authentication when disabled", () => {
		const userWithoutTwoFactor = {
			...mockUser,
			isTwoFactorEnabled: false,
		};

		render(<UserInfo user={userWithoutTwoFactor} />);

		expect(screen.getByText(labels.disabled)).toBeInTheDocument();
		const crossIcon = screen.getByText(labels.disabled).previousSibling;
		expect(crossIcon).toBeInTheDocument();
	});

	it("displays correct badge for 2FA status", () => {
		render(<UserInfo user={mockUser} />);

		const badges = screen.getAllByTestId("badge");
		expect(badges[1]).toHaveTextContent("2FA Enabled");
		expect(badges[1]).toHaveAttribute("data-variant", "success");
	});

	it("displays fallback avatar with initials when no image", () => {
		render(<UserInfo user={mockUser} />);

		const fallback = screen.getByTestId("avatar-fallback");
		expect(fallback).toHaveTextContent("JD");
	});
});

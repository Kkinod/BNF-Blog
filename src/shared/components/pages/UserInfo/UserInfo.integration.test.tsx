import React from "react";
import { render, screen } from "@testing-library/react";
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

jest.mock("@/shared/components/ui/card", () => ({
	Card: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="card" className={className}>
			{children}
		</div>
	),
	CardHeader: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="card-header">{children}</div>
	),
	CardContent: ({ children, className }: { children: React.ReactNode; className: string }) => (
		<div data-testid="card-content" className={className}>
			{children}
		</div>
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

describe("UserInfo Integration", () => {
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

	it("renders with all UI components correctly", () => {
		render(<UserInfo user={mockUser} />);

		const cards = screen.getAllByTestId("card");
		expect(cards).toHaveLength(2);
		expect(screen.getByTestId("card-header")).toBeInTheDocument();
		expect(screen.getByTestId("card-content")).toBeInTheDocument();
		expect(screen.getByTestId("avatar")).toBeInTheDocument();
		expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
	});

	it("displays 2FA badges with correct variants", () => {
		render(<UserInfo user={mockUser} />);

		const badges = screen.getAllByTestId("badge");
		expect(badges.length).toBeGreaterThan(1);

		expect(badges[0]).toHaveTextContent(UserRole.ADMIN);
		expect(badges[0]).toHaveAttribute("data-variant", "outline");

		expect(badges[1]).toHaveTextContent("2FA Enabled");
		expect(badges[1]).toHaveAttribute("data-variant", "success");
	});

	it("displays 2FA disabled badge when 2FA is disabled", () => {
		const userWithoutTwoFactor = {
			...mockUser,
			isTwoFactorEnabled: false,
		};

		render(<UserInfo user={userWithoutTwoFactor} />);

		const badges = screen.getAllByTestId("badge");
		expect(badges[1]).toHaveTextContent("2FA Disabled");
		expect(badges[1]).toHaveAttribute("data-variant", "destructive");
	});

	it("displays all user information fields with correct icons", () => {
		render(<UserInfo user={mockUser} />);

		expect(screen.getByText(labels.userInformation)).toBeInTheDocument();
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

		const adminRoles = screen.getAllByText(UserRole.ADMIN);
		expect(adminRoles.length).toBeGreaterThan(0);
	});

	it("renders avatar fallback with correct initials", () => {
		render(<UserInfo user={mockUser} />);

		const fallback = screen.getByTestId("avatar-fallback");
		expect(fallback).toHaveTextContent("JD");
	});

	it("handles undefined user gracefully", () => {
		render(<UserInfo />);

		expect(screen.getByText(labels.id)).toBeInTheDocument();
		expect(screen.getByText(labels.name)).toBeInTheDocument();
		expect(screen.getByText(labels.email)).toBeInTheDocument();
		expect(screen.getByText(labels.role)).toBeInTheDocument();
		expect(screen.getByText(labels.twoFactorAuthentication)).toBeInTheDocument();

		const badges = screen.getAllByTestId("badge");
		const twoFactorBadge = badges.find((badge) => badge.textContent === "2FA Disabled");
		expect(twoFactorBadge).toBeInTheDocument();
		expect(twoFactorBadge).toHaveAttribute("data-variant", "destructive");

		const nameHeader = screen.getByRole("heading", { level: 2 });
		expect(nameHeader).toHaveTextContent("User");

		const fallback = screen.getByTestId("avatar-fallback");
		expect(fallback).toHaveTextContent("U");
	});
});

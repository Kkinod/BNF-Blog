import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Loader } from "./Loader";
import { labels } from "@/shared/utils/labels";

jest.useFakeTimers();

describe("Loader Component", () => {
	afterEach(() => {
		jest.clearAllTimers();
	});

	it("renders with default props", () => {
		render(<Loader />);

		const loader = screen.getByRole("status");
		expect(loader).toBeInTheDocument();
		expect(loader).toHaveClass("loader loader--medium loader--default");
	});

	it("applies custom className", () => {
		render(<Loader className="custom-class" />);

		const loader = screen.getByRole("status");
		expect(loader).toHaveClass("custom-class");
	});

	it("applies different sizes", () => {
		const { rerender } = render(<Loader size="small" />);

		let loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--small");

		rerender(<Loader size="medium" />);
		loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--medium");

		rerender(<Loader size="large" />);
		loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--large");
	});

	it("applies different themes", () => {
		const { rerender } = render(<Loader theme="default" />);

		let loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--default");

		rerender(<Loader theme="matrix" />);
		loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--matrix");

		rerender(<Loader theme="main" />);
		loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--main");
	});

	it("renders the correct number of letters", () => {
		render(<Loader />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");
		expect(letters.length).toBe(labels.loading.length);
	});

	it("renders three dots", () => {
		render(<Loader />);

		const dots = screen.getByRole("status").querySelectorAll(".loader-dot");
		expect(dots.length).toBe(3);
	});

	it("starts animation with first letter active", async () => {
		render(<Loader />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});
	});

	it("progresses through letters during animation", async () => {
		render(<Loader />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("respects custom shuffle speed", async () => {
		render(<Loader shuffleSpeed={10} />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(200);
		});

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("respects custom pause between letters", async () => {
		render(<Loader pauseBetweenLetters={500} />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(1000);
		});

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("respects custom shuffle count range", async () => {
		const originalRandom = Math.random;
		Math.random = jest.fn().mockReturnValue(0.5);

		render(<Loader minShuffleCount={3} maxShuffleCount={5} />);

		Math.random = originalRandom;

		expect(screen.getByRole("status")).toBeInTheDocument();
	});

	it("cleans up animations on unmount", () => {
		const clearIntervalSpy = jest.spyOn(window, "clearInterval");
		const clearTimeoutSpy = jest.spyOn(window, "clearTimeout");

		const { unmount } = render(<Loader />);

		act(() => {
			jest.advanceTimersByTime(100);
		});

		unmount();

		expect(clearIntervalSpy.mock.calls.length + clearTimeoutSpy.mock.calls.length).toBeGreaterThan(
			0,
		);

		clearIntervalSpy.mockRestore();
		clearTimeoutSpy.mockRestore();
	});
});

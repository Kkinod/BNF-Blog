import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Loader } from "./Loader";
import { labels } from "@/shared/utils/labels";

jest.useFakeTimers();

describe("Loader Integration Tests", () => {
	afterEach(() => {
		jest.clearAllTimers();
	});

	it("completes a full animation cycle for all letters", async () => {
		render(<Loader shuffleSpeed={10} pauseBetweenLetters={50} />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");
		const loadingText = labels.loading;

		for (let i = 0; i < loadingText.length; i++) {
			await waitFor(() => {
				expect(letters[i]).toHaveClass("loader-letter--active");
			});

			act(() => {
				jest.advanceTimersByTime(500);
			});
		}

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});
	});

	it("works with different themes and sizes simultaneously", async () => {
		const { rerender } = render(<Loader theme="matrix" size="large" />);

		let loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--matrix");
		expect(loader).toHaveClass("loader--large");

		const letters = loader.querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(500);
		});

		rerender(<Loader theme="main" size="small" />);

		loader = screen.getByRole("status");
		expect(loader).toHaveClass("loader--main");
		expect(loader).toHaveClass("loader--small");

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("handles rapid prop changes without breaking animation", async () => {
		const { rerender } = render(<Loader shuffleSpeed={20} />);

		await waitFor(() => {
			const letters = screen.getByRole("status").querySelectorAll(".loader-letter");
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(100);
		});

		rerender(<Loader shuffleSpeed={10} />);

		act(() => {
			jest.advanceTimersByTime(100);
		});

		rerender(<Loader shuffleSpeed={5} />);

		act(() => {
			jest.advanceTimersByTime(100);
		});

		await waitFor(() => {
			const letters = screen.getByRole("status").querySelectorAll(".loader-letter");
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("maintains animation state when className changes", async () => {
		const { rerender } = render(<Loader className="test-class-1" />);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(500);
		});

		rerender(<Loader className="test-class-2" />);

		const loader = screen.getByRole("status");
		expect(loader).toHaveClass("test-class-2");
		expect(loader).not.toHaveClass("test-class-1");

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});
	});

	it("dots animation continues throughout letter animations", async () => {
		render(<Loader />);

		const dots = screen.getByRole("status").querySelectorAll(".loader-dot");
		expect(dots.length).toBe(3);

		const letters = screen.getByRole("status").querySelectorAll(".loader-letter");

		await waitFor(() => {
			expect(letters[0]).toHaveClass("loader-letter--active");
		});

		act(() => {
			jest.advanceTimersByTime(500);
		});

		await waitFor(() => {
			expect(letters[1]).toHaveClass("loader-letter--active");
		});

		expect(dots[0]).toBeInTheDocument();
		expect(dots[1]).toBeInTheDocument();
		expect(dots[2]).toBeInTheDocument();
	});
});

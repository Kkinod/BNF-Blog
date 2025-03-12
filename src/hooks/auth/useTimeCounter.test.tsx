import { renderHook, act } from "@testing-library/react";
import { useTimeCounter } from "./useTimeCounter";

// Mock dla funkcji setInterval i clearInterval
jest.useFakeTimers();

describe("useTimeCounter", () => {
	afterEach(() => {
		jest.clearAllTimers();
	});

	it("should initialize with default values", () => {
		const { result } = renderHook(() => useTimeCounter());

		expect(result.current.timeRemaining).toBe(0);
		expect(result.current.isActive).toBe(false);
		expect(result.current.isExpired).toBe(true);
	});

	it("should initialize with provided initial value", () => {
		const { result } = renderHook(() => useTimeCounter(60));

		expect(result.current.timeRemaining).toBe(60);
		expect(result.current.isActive).toBe(true);
		expect(result.current.isExpired).toBe(false);
	});

	it("should count down when active", () => {
		const { result } = renderHook(() => useTimeCounter(3));

		expect(result.current.timeRemaining).toBe(3);

		// Advance timer by 1 second
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(result.current.timeRemaining).toBe(2);

		// Advance timer by 2 more seconds
		act(() => {
			jest.advanceTimersByTime(2000);
		});

		expect(result.current.timeRemaining).toBe(0);
		expect(result.current.isActive).toBe(false);
		expect(result.current.isExpired).toBe(true);
	});

	it("should call onComplete callback when timer expires", () => {
		const onComplete = jest.fn();
		const { result } = renderHook(() => useTimeCounter(1, onComplete));

		// Advance timer by 1 second
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		expect(onComplete).toHaveBeenCalledTimes(1);
		expect(result.current.isExpired).toBe(true);
	});

	it("should format time correctly", () => {
		const { result } = renderHook(() => useTimeCounter());

		expect(result.current.formatTime(65)).toBe("01:05");
		expect(result.current.formatTime(3600)).toBe("60:00");
		expect(result.current.formatTime(0)).toBe("00:00");
	});

	it("should start timer with provided value", () => {
		const { result } = renderHook(() => useTimeCounter());

		act(() => {
			result.current.start(30);
		});

		expect(result.current.timeRemaining).toBe(30);
		expect(result.current.isActive).toBe(true);
		expect(result.current.isExpired).toBe(false);
	});

	it("should stop timer", () => {
		const { result } = renderHook(() => useTimeCounter(60));

		act(() => {
			result.current.stop();
		});

		expect(result.current.isActive).toBe(false);

		// Advance timer by 1 second
		act(() => {
			jest.advanceTimersByTime(1000);
		});

		// Time should not change because timer is stopped
		expect(result.current.timeRemaining).toBe(60);
	});

	it("should reset timer", () => {
		const { result } = renderHook(() => useTimeCounter(60));

		// Advance timer by 10 seconds
		act(() => {
			jest.advanceTimersByTime(10000);
		});

		expect(result.current.timeRemaining).toBe(50);

		act(() => {
			result.current.reset(120);
		});

		expect(result.current.timeRemaining).toBe(120);
		expect(result.current.isActive).toBe(true);
		expect(result.current.isExpired).toBe(false);

		act(() => {
			result.current.reset(0);
		});

		expect(result.current.timeRemaining).toBe(0);
		expect(result.current.isActive).toBe(false);
		expect(result.current.isExpired).toBe(true);
	});
});

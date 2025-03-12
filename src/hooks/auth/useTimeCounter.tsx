import { useState, useEffect } from "react";

/**
 * Custom hook for managing a countdown timer
 * @param initialValue - Initial time in seconds
 * @param onComplete - Callback function to execute when timer completes
 * @returns Object with timer state and control methods
 */
export const useTimeCounter = (initialValue: number = 0, onComplete?: () => void) => {
	const [timeRemaining, setTimeRemaining] = useState<number>(initialValue);
	const [isActive, setIsActive] = useState<boolean>(initialValue > 0);
	const [isExpired, setIsExpired] = useState<boolean>(initialValue <= 0);

	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (isActive && timeRemaining > 0) {
			interval = setInterval(() => {
				setTimeRemaining((prevTime) => {
					// Calculate new time
					const newTime = prevTime - 1;

					// Check if timer has expired
					if (newTime <= 0) {
						if (interval) clearInterval(interval);
						setIsActive(false);
						setIsExpired(true);
						if (onComplete) onComplete();
						return 0; // Ensure we return exactly 0, not a negative value
					}

					return newTime;
				});
			}, 1000);
		} else if (timeRemaining <= 0 && isActive) {
			// Handle case where timer might be active but time is already 0
			setIsActive(false);
			setIsExpired(true);
			if (onComplete) onComplete();
		}

		// Cleanup interval on unmount or when dependencies change
		return () => {
			if (interval) clearInterval(interval);
		};
	}, [isActive, timeRemaining, onComplete]);

	/**
	 * Format seconds into MM:SS format
	 * @param seconds - Time in seconds
	 * @returns Formatted time string
	 */
	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	/**
	 * Start the timer with a specified value
	 * @param value - Time in seconds
	 */
	const start = (value: number) => {
		if (value > 0) {
			setTimeRemaining(value);
			setIsActive(true);
			setIsExpired(false);
		}
	};

	const stop = () => {
		setIsActive(false);
	};

	const reset = (value: number) => {
		setTimeRemaining(value);
		setIsActive(value > 0);
		setIsExpired(value <= 0);
	};

	return {
		timeRemaining,
		isActive,
		isExpired,
		formatTime,
		start,
		stop,
		reset,
	};
};

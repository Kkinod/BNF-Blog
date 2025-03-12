import { useState, useEffect } from "react";

export const useTimeCounter = (initialValue: number = 0, onComplete?: () => void) => {
	const [timeRemaining, setTimeRemaining] = useState<number>(initialValue);
	const [isActive, setIsActive] = useState<boolean>(initialValue > 0);
	const [isExpired, setIsExpired] = useState<boolean>(initialValue <= 0);

	useEffect(() => {
		if (!isActive) return;

		const calculateTimeRemaining = () => {
			const remaining = Math.max(0, timeRemaining - 1);
			setTimeRemaining(remaining);

			if (remaining <= 0) {
				setIsExpired(true);
				setIsActive(false);
				onComplete?.();
			}
		};

		const interval = setInterval(calculateTimeRemaining, 1000);
		return () => clearInterval(interval);
	}, [isActive, timeRemaining, onComplete]);

	const formatTime = (seconds: number): string => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	const start = (value: number) => {
		setTimeRemaining(value);
		setIsActive(true);
		setIsExpired(false);
	};

	const stop = () => {
		setIsActive(false);
	};

	const reset = (value: number = initialValue) => {
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

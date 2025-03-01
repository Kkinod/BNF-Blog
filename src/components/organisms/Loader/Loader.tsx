import { memo, useCallback, useEffect, useRef, useState } from "react";
import { labels } from "@/views/labels";
import "./loader.css";

interface LoaderProps {
	className?: string;
	size?: "small" | "medium" | "large";
	theme?: "default" | "matrix" | "main";
	minShuffleCount?: number;
	maxShuffleCount?: number;
	shuffleSpeed?: number;
	pauseBetweenLetters?: number;
}

export const Loader = memo(
	({
		className = "",
		size = "medium",
		theme = "default",
		minShuffleCount = 5,
		maxShuffleCount = 20,
		shuffleSpeed = 50,
		pauseBetweenLetters = 100,
	}: LoaderProps) => {
		const originalText = labels.loading;
		const [displayedText, setDisplayedText] = useState<string[]>(() => originalText.split(""));
		const [activeIndex, setActiveIndex] = useState(0);
		const [shuffleCounter, setShuffleCounter] = useState(0);
		const [isShuffling, setIsShuffling] = useState(true);
		const [currentLetterShuffleCount, setCurrentLetterShuffleCount] = useState(
			() => Math.floor(Math.random() * (maxShuffleCount - minShuffleCount + 1)) + minShuffleCount,
		);

		const isMountedRef = useRef(true);
		const animationRef = useRef<{
			interval: NodeJS.Timeout | null;
			timeout: NodeJS.Timeout | null;
		}>({
			interval: null,
			timeout: null,
		});

		const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

		const getRandomChar = () => characters.charAt(Math.floor(Math.random() * characters.length));

		const clearAnimations = useCallback(() => {
			if (animationRef.current.interval) {
				clearInterval(animationRef.current.interval);
				animationRef.current.interval = null;
			}
			if (animationRef.current.timeout) {
				clearTimeout(animationRef.current.timeout);
				animationRef.current.timeout = null;
			}
		}, []);

		const updateChar = useCallback((index: number, char: string) => {
			if (!isMountedRef.current) return;
			setDisplayedText((prev) => {
				if (prev[index] === char) return prev;
				const newText = [...prev];
				newText[index] = char;
				return newText;
			});
		}, []);

		const moveToNextLetter = useCallback(() => {
			if (!isMountedRef.current) return;
			setActiveIndex((prevIndex) => {
				if (prevIndex >= originalText.length - 1) {
					return 0;
				}
				return prevIndex + 1;
			});
			setIsShuffling(true);
			setShuffleCounter(0);
			setCurrentLetterShuffleCount(
				Math.floor(Math.random() * (maxShuffleCount - minShuffleCount + 1)) + minShuffleCount,
			);
		}, [originalText.length, maxShuffleCount, minShuffleCount]);

		useEffect(() => {
			clearAnimations();

			if (isShuffling) {
				animationRef.current.interval = setInterval(() => {
					if (!isMountedRef.current) return;

					const randomChar = getRandomChar();
					updateChar(activeIndex, randomChar);
					setShuffleCounter((prev) => prev + 1);

					if (shuffleCounter >= currentLetterShuffleCount - 1) {
						clearAnimations();
						updateChar(activeIndex, originalText[activeIndex]);
						setIsShuffling(false);
					}
				}, shuffleSpeed);
			} else {
				animationRef.current.timeout = setTimeout(moveToNextLetter, pauseBetweenLetters);
			}

			return clearAnimations;
		}, [
			activeIndex,
			isShuffling,
			shuffleCounter,
			currentLetterShuffleCount,
			shuffleSpeed,
			pauseBetweenLetters,
			originalText,
			clearAnimations,
			updateChar,
			moveToNextLetter,
		]);

		useEffect(() => {
			isMountedRef.current = true;

			return () => {
				isMountedRef.current = false;
				clearAnimations();
			};
		}, [clearAnimations]);

		const renderLetters = () => {
			return displayedText.map((letter, index) => (
				<span
					key={index}
					className={`loader-letter ${index === activeIndex ? "loader-letter--active" : ""}`}
				>
					{letter}
				</span>
			));
		};

		return (
			<div
				className={`loader ${className} loader--${size} loader--${theme}`}
				role="status"
				aria-live="polite"
			>
				<div className="loader-text">
					{renderLetters()}
					<span className="loader-dots">
						<span className="loader-dot">.</span>
						<span className="loader-dot">.</span>
						<span className="loader-dot">.</span>
					</span>
				</div>
			</div>
		);
	},
);

Loader.displayName = "Loader";

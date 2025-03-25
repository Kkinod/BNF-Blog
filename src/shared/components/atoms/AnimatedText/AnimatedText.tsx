import { memo } from "react";
import "./animatedText.css";

interface AnimatedTextProps {
	text: string;
	className?: string;
	size?: "small" | "medium" | "large";
	theme?: "default" | "matrix" | "main";
	withDots?: boolean;
}

export const AnimatedText = memo(
	({
		text,
		className = "",
		size = "small",
		theme = "default",
		withDots = true,
	}: AnimatedTextProps) => {
		return (
			<div className={`animated-text animated-text--${size} animated-text--${theme} ${className}`}>
				<span className="animated-text-content">{text}</span>
				{withDots && (
					<div className="animated-text-dots">
						<span className="animated-text-dot">.</span>
						<span className="animated-text-dot">.</span>
						<span className="animated-text-dot">.</span>
					</div>
				)}
			</div>
		);
	},
);

AnimatedText.displayName = "AnimatedText";

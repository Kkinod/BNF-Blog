import { memo } from "react";
// eslint-disable-next-line import/no-unresolved
import { labels } from "@/shared/utils/labels";
import "./simpleLoader.css";

interface SimpleLoaderProps {
	className?: string;
	size?: "small" | "medium" | "large";
	theme?: "default" | "matrix" | "main";
}

export const SimpleLoader = memo(
	({ className = "", size = "medium", theme = "default" }: SimpleLoaderProps) => {
		const text = labels.loading;

		return (
			<div className={`simple-loader simple-loader--${size} simple-loader--${theme} ${className}`}>
				<div className="simple-loader-text">
					{text.split("").map((letter, index) => (
						<span key={index} className="simple-loader-letter">
							{letter}
						</span>
					))}
					<div className="simple-loader-dots">
						<span className="simple-loader-dot">.</span>
						<span className="simple-loader-dot">.</span>
						<span className="simple-loader-dot">.</span>
					</div>
				</div>
			</div>
		);
	},
);

SimpleLoader.displayName = "SimpleLoader";

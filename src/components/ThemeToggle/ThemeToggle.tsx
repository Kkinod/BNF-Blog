"use client";

import Image from "next/image";
import "./themeToggle.css";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const ThemeToggle = () => {
	const { theme, toggle } = useContext(ThemeContext);

	return (
		<div
			className="themeToggle"
			onClick={toggle}
			style={theme === "dark" ? { backgroundColor: "white" } : { backgroundColor: "#0f172a" }}
		>
			<Image src="/moon.png" alt="moon" width={14} height={14} />
			<div
				className="ball"
				style={
					theme === "dark"
						? { left: 1, backgroundColor: "#0f172a" }
						: { right: 1, backgroundColor: "white" }
				}
			></div>
			<Image src="/sun.png" alt="sun" width={14} height={14} />
		</div>
	);
};

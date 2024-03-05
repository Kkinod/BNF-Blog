"use client";

import Image from "next/image";
import "./themeToggle.css";
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const ThemeToggle = () => {
	const { theme, toggle } = useContext(ThemeContext);

	return (
		<div
			className={`themeToggle ${theme === "dark" ? "themeToggle--dark" : "themeToggle--light"}`}
			onClick={toggle}
		>
			<Image src="/moon.png" alt="moon" width={14} height={14} />
			<div className={`ball ${theme === "dark" ? "ball--dark" : "ball--light"}`} />
			<Image src="/sun.png" alt="sun" width={14} height={14} />
		</div>
	);
};

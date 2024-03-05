"use client";

import { createContext, type ReactNode, useState, useEffect } from "react";

interface ThemeContextType {
	theme: string;
	toggle: () => void;
}

const defaultValue: ThemeContextType = {
	theme: "light",
	toggle: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);

const getThemeFromLocalStorage = () => {
	if (typeof window !== "undefined") {
		const storedTheme = localStorage.getItem("theme");
		return storedTheme || "light";
	}
	return "light";
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<string>(() => getThemeFromLocalStorage());

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	const toggle = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
};

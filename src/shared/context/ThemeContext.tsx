"use client";

import { createContext, type ReactNode, useState, useEffect, useContext } from "react";

interface ThemeContextType {
	theme: string;
	toggle: () => void;
}

const defaultValue: ThemeContextType = {
	theme: "dark",
	toggle: () => {},
};

export const ThemeContext = createContext<ThemeContextType>(defaultValue);

const getThemeFromLocalStorage = () => {
	if (typeof window !== "undefined") {
		const storedTheme = localStorage.getItem("theme");
		return storedTheme || "dark";
	}
	return "dark";
};

export const ThemeContextProvider = ({ children }: { children: ReactNode }) => {
	const [theme, setTheme] = useState<string>(() => getThemeFromLocalStorage());
	const [mounted, setMounted] = useState<boolean>(false);

	useEffect(() => {
		localStorage.setItem("theme", theme);
	}, [theme]);

	useEffect(() => {
		setMounted(true);
	}, []);

	const toggle = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	if (!mounted) {
		return null;
	}

	return (
		<ThemeContext.Provider value={{ theme, toggle }}>
			<div className={theme}>{children}</div>
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);

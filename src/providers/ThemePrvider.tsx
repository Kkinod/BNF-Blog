"use client";

import { type ReactNode, useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/context/ThemeContext";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
	const [mounted, setMounted] = useState<boolean>(false);
	const { theme } = useContext(ThemeContext);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (mounted) {
		return <div className={theme}>{children}</div>;
	}
};

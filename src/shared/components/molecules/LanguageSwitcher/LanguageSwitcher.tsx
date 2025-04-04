"use client";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useCallback } from "react";
import Cookies from "js-cookie";

export const LanguageSwitcher = () => {
	const { currentLanguage, changeLanguage } = useTranslation();
	const router = useRouter();
	const pathname = usePathname();
	const params = useParams();

	const toggleLanguage = useCallback(() => {
		const newLanguage = currentLanguage === "pl" ? "en" : "pl";
		const currentLocale = params.locale as string;

		// Update cookie for consistency
		Cookies.set("i18next", newLanguage, {
			expires: 365,
			path: "/",
			domain: window.location.hostname === "localhost" ? undefined : window.location.hostname,
		});

		// Change language in i18next
		changeLanguage(newLanguage);

		// Calculate new URL by replacing current locale with new one
		const newPathname = pathname.replace(`/${currentLocale}`, `/${newLanguage}`);

		// Navigate to new URL
		router.push(newPathname);
	}, [currentLanguage, changeLanguage, pathname, params.locale, router]);

	return (
		<button onClick={toggleLanguage} className="language-switcher" aria-label="Toggle language">
			{currentLanguage === "pl" ? "EN" : "PL"}
		</button>
	);
};

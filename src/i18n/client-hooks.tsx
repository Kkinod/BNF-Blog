"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "./settings";
import i18n from "./client";

export function useClientTranslation() {
	const { t, i18n } = useTranslation();
	const pathname = usePathname();

	useEffect(() => {
		const segments = pathname.split("/");
		const pathnameLocale = segments.length > 1 ? segments[1] : null;

		if (pathnameLocale && i18nConfig.locales.includes(pathnameLocale)) {
			if (i18n.language !== pathnameLocale) {
				void i18n.changeLanguage(pathnameLocale);
			}
		}
	}, [pathname, i18n]);

	return { t, i18n };
}

export function useChangeLanguage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const changeLanguage = (newLocale: string) => {
		if (!i18nConfig.locales.includes(newLocale)) return;

		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

		const segments = pathname.split("/");

		if (segments.length > 1 && i18nConfig.locales.includes(segments[1])) {
			segments[1] = newLocale;
		} else {
			segments.unshift(newLocale);
		}

		const newPath = segments.join("/");

		// Using the built-in `useSearchParams` – SSR-safe
		const query = searchParams.toString();
		const fullPath = query ? `${newPath}?${query}` : newPath;

		void i18n.changeLanguage(newLocale);
		router.push(fullPath);
	};

	return changeLanguage;
}

"use client";

import { useTranslation as useReactI18next } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { i18nConfig } from "@/i18n/settings";

interface TranslationParams {
	locale?: string;
}

export function useTranslation({ locale }: TranslationParams = {}) {
	const { t, i18n } = useReactI18next();
	const router = useRouter();
	const pathname = usePathname();

	const currentLocale = locale || i18n.language || i18nConfig.defaultLocale;

	const changeLocale = (newLocale: string) => {
		if (newLocale === currentLocale) return;
		if (!i18nConfig.locales.includes(newLocale)) return;

		document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}`;

		let newPath = "";

		// Obsługa ścieżki głównej
		if (pathname === "/") {
			newPath = `/${newLocale}`;
		} else {
			// Pracujemy na kopii segmentów, aby uniknąć mutacji
			const segments = [...pathname.split("/")];

			if (segments.length > 1 && i18nConfig.locales.includes(segments[1])) {
				segments[1] = newLocale;
				newPath = segments.join("/");
			} else {
				// Unikanie zduplikowanych znaków "/"
				const cleanPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
				newPath = `/${newLocale}${cleanPath}`;
			}
		}

		i18n.changeLanguage(newLocale);
		router.push(newPath);
	};

	return {
		locale: currentLocale,
		changeLocale,
		t,
	};
}

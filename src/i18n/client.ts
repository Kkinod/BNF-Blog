"use client";

import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import plResources from "../../public/locales/pl/translation.json";
import enResources from "../../public/locales/en/translation.json";
import { i18nConfig } from "./settings";

const resources = {
	pl: {
		translation: plResources,
	},
	en: {
		translation: enResources,
	},
};

if (!i18next.isInitialized) {
	void i18next
		.use(initReactI18next)
		.use(LanguageDetector)
		.init({
			resources,
			fallbackLng: i18nConfig.defaultLocale,
			supportedLngs: i18nConfig.locales,
			defaultNS: "translation",
			debug: process.env.NODE_ENV === "development",
			interpolation: {
				escapeValue: false,
			},
			detection: {
				order: ["path", "cookie", "navigator"],
				lookupFromPathIndex: 0,
				lookupCookie: "NEXT_LOCALE",
				caches: ["cookie"],
			},
			react: {
				useSuspense: false,
			},
		});
}

// eslint-disable-next-line import/no-default-export
export default i18next;

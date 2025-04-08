"use client";

import { useClientTranslation, useChangeLanguage } from "@/i18n/client-hooks";
import { i18nConfig } from "@/i18n/settings";
import "./languageSwitcher.css";

export const LanguageSwitcher = () => {
	const { i18n } = useClientTranslation();
	const changeLanguage = useChangeLanguage();

	const locale = i18n.language || i18nConfig.defaultLocale;
	const nextLocale =
		locale === i18nConfig.locales[0] ? i18nConfig.locales[1] : i18nConfig.locales[0];

	const toggleLanguage = () => {
		changeLanguage(nextLocale);
	};

	return (
		<div className="language-switcher">
			<button
				className="lang-toggle-btn"
				onClick={toggleLanguage}
				aria-label={`Change language to ${nextLocale.toUpperCase()}`}
			>
				{locale.toUpperCase()}
			</button>
		</div>
	);
};

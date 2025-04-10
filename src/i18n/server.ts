import { createInstance, type Resource } from "i18next";

import plResources from "../../public/locales/pl/translation.json";
import enResources from "../../public/locales/en/translation.json";
import { i18nConfig } from "./settings";

const resources: Resource = {
	pl: {
		translation: plResources,
	},
	en: {
		translation: enResources,
	},
};

export async function initTranslations(locale: string, namespaces: string[] = ["translation"]) {
	const i18nInstance = createInstance();

	await i18nInstance.init({
		lng: locale,
		resources,
		fallbackLng: i18nConfig.defaultLocale,
		supportedLngs: i18nConfig.locales,
		defaultNS: namespaces[0],
		fallbackNS: namespaces[0],
		ns: namespaces,
	});

	return {
		i18n: i18nInstance,
		t: i18nInstance.getFixedT(locale, namespaces[0]),
	};
}

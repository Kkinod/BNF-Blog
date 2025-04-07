import { initTranslations } from "@/i18n";

export async function useServerTranslation(locale: string, namespaces: string[] = ["translation"]) {
	const { t } = await initTranslations(locale, namespaces);
	return { t };
}

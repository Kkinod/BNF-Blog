import { getTranslations } from "@/shared/utils/translations";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { currentUser } from "@/features/auth/utils/currentUser";

export async function getSharedViewData(locale: string) {
	const t = await getTranslations(locale);
	const localizedRoutes = getLocalizedRoutes(locale);
	const session = await currentUser();

	return {
		t,
		localizedRoutes,
		session,
	};
}

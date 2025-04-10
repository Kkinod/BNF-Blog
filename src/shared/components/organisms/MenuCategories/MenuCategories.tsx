import Link from "next/link";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { getTranslations } from "@/shared/utils/translations";
import { i18nConfig } from "@/i18n/settings";
import "./menuCategories.css";

export const MenuCategories = async ({
	locale = i18nConfig.defaultLocale,
}: {
	locale?: string;
}) => {
	const data = await getDataCategoriesServer();
	const localizedRoutes = getLocalizedRoutes(locale);
	const t = await getTranslations(locale);

	return (
		<div className="menu__categoryList">
			{data.map((item) => (
				<Link
					key={item.id}
					href={localizedRoutes.category(item.slug)}
					className={`category__item category--${item.slug}`}
				>
					{t(`categories.${item.slug}`, { defaultValue: item.title })}
				</Link>
			))}
		</div>
	);
};

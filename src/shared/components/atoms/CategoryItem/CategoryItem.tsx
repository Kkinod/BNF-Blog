"use client";

import "./categoryItem.css";
import { useRouter, useParams } from "next/navigation";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "@/i18n/settings";

export const CategoryItem = ({ category }: { category: string }) => {
	const router = useRouter();
	const params = useParams();
	const { t, i18n } = useTranslation();

	const locale = i18n.language || (params.locale as string) || i18nConfig.defaultLocale;
	const localizedRoutes = getLocalizedRoutes(locale);

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		router.push(localizedRoutes.category(category));
	};

	const categoryLabel = t(`categories.${category.toLowerCase()}`, { defaultValue: category });

	return (
		<button
			onClick={handleClick}
			className={`item__textCategory category--${category.toLowerCase()}`}
		>
			{categoryLabel}
		</button>
	);
};

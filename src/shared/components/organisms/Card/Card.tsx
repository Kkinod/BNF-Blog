"use client";

import Image from "next/image";
import Link from "next/link";
import defaultImage from "../../../../../public/defaultImgPost.webp";
import { type ListPost } from "@/app/api/posts/route";
import { CategoryItem } from "@/shared/components/atoms/CategoryItem/CategoryItem";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { useTranslation } from "react-i18next";
import { i18nConfig } from "@/i18n/settings";
import "./card.css";

export type PostCard = ListPost;

interface CardProps {
	item: PostCard;
	locale?: string;
}

export const Card = ({ item, locale = "pl" }: CardProps) => {
	const { t, i18n } = useTranslation();
	const currentLocale = i18n.language || locale || i18nConfig.defaultLocale;
	const localizedRoutes = getLocalizedRoutes(currentLocale);

	return (
		<div className="post__wrapper">
			<Link href={localizedRoutes.post(item.slug, item.catSlug)} className="post__imageContainer">
				<Image src={item.img || defaultImage} alt="main post photo" fill className="post__image" />
				<div className="textContainer">
					<CategoryItem category={item.catSlug} />
					<h1 className="textContainer__title">{item.title}</h1>
					<div className="mt-8 flex justify-between">
						<div className="textContainer__link">
							{t("card.readMore", { defaultValue: "Read More" })}
						</div>
						<span className="textContainer__date">{item.createdAt.substring(0, 10)}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

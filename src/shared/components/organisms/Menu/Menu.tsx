import { MenuPost } from "../../molecules/MenuPost/MenuPost";
import { MenuCategories } from "../MenuCategories/MenuCategories";
import { getPopularPosts } from "@/features/blog/api/popularPosts/request";
import { getPickPosts } from "@/features/blog/api/pickPosts/request";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { getTranslations } from "@/shared/utils/translations";
import { i18nConfig } from "@/i18n/settings";
import { labels } from "@/shared/utils/labels";
import { formatDate } from "@/shared/utils/formatters";
import "./menu.css";

export const Menu = async ({ locale = i18nConfig.defaultLocale }: { locale?: string }) => {
	const popularPosts = await getPopularPosts();
	const pickPosts = await getPickPosts();
	const localizedRoutes = getLocalizedRoutes(locale);
	const t = await getTranslations(locale);

	return (
		<div className="menu">
			<h2 className="menu__subtitle">
				{t("menu.whatsHot", { defaultValue: labels.menu.whatsHot })}
			</h2>
			<h1 className="menu__title">
				{t("menu.mostViewed", { defaultValue: labels.menu.mostViewed })}
			</h1>
			{popularPosts.map((post) => (
				<MenuPost
					key={post.id}
					withImage={true}
					linkHref={localizedRoutes.post(post.slug, post.catSlug)}
					categoryTitle={post.catSlug}
					text={post.title}
					textName={post.user.name || ""}
					textDate={formatDate(post.createdAt, "long", locale)}
				/>
			))}

			<h2 className="menu__subtitle">
				{t("menu.discoverByTopic", { defaultValue: labels.menu.discoverByTopic })}
			</h2>
			<h1 className="menu__title">
				{t("menu.categories", { defaultValue: labels.menu.categories })}
			</h1>
			<MenuCategories locale={locale} />

			<h2 className="menu__subtitle">
				{t("menu.chosenByTheEditor", { defaultValue: labels.menu.chosenByTheEditor })}
			</h2>
			<h1 className="menu__title">
				{t("menu.editorsPick", { defaultValue: labels.menu.editorsPick })}
			</h1>
			{pickPosts.map((post) => (
				<MenuPost
					key={post.id}
					withImage={true}
					linkHref={localizedRoutes.post(post.slug, post.catSlug)}
					categoryTitle={post.catSlug}
					text={post.title}
					textName={post.user.name || ""}
					textDate={formatDate(post.createdAt, "long", locale)}
				/>
			))}
		</div>
	);
};

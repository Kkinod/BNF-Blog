import { MenuPost } from "../../molecules/MenuPost/MenuPost";
import { MenuCategories } from "../MenuCategories/MenuCategories";
import { getPopularPosts } from "@/features/blog/api/popularPosts/request";
import { getPickPosts } from "@/features/blog/api/pickPosts/request";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { getTranslations } from "@/shared/utils/translations";
import { i18nConfig } from "@/i18n/settings";
import "./menu.css";

export const Menu = async ({ locale = i18nConfig.defaultLocale }: { locale?: string }) => {
	const popularPosts = await getPopularPosts();
	const pickPosts = await getPickPosts();
	const localizedRoutes = getLocalizedRoutes(locale);
	const t = await getTranslations(locale);

	return (
		<div className="menu">
			<h2 className="menu__subtitle">{t("whatsHot", { defaultValue: "What's hot" })}</h2>
			<h1 className="menu__title">{t("mostPopular", { defaultValue: "Most Viewed" })}</h1>
			{popularPosts.map((post) => (
				<MenuPost
					key={post.id}
					withImage={true}
					linkHref={localizedRoutes.post(post.slug, post.catSlug)}
					categoryTitle={post.catSlug}
					text={post.title}
					textName={post.user.name || ""}
					textDate={new Date(post.createdAt).toLocaleDateString("en-US", {
						year: "numeric",
						month: "short",
						day: "numeric",
					})}
				/>
			))}

			<h2 className="menu__subtitle">
				{t("discoverByTopic", { defaultValue: "Discover by topic" })}
			</h2>
			<h1 className="menu__title">{t("categories", { defaultValue: "Categories" })}</h1>
			<MenuCategories locale={locale} />

			<h2 className="menu__subtitle">
				{t("chosenByTheEditor", { defaultValue: "Chosen by the editor" })}
			</h2>
			<h1 className="menu__title">{t("editorsPick", { defaultValue: "Editors Pick" })}</h1>
			{pickPosts.map((post) => (
				<MenuPost
					key={post.id}
					withImage={true}
					linkHref={localizedRoutes.post(post.slug, post.catSlug)}
					categoryTitle={post.catSlug}
					text={post.title}
					textName={post.user.name || ""}
					textDate={new Date(post.createdAt).toLocaleDateString(
						locale === "pl" ? "pl-PL" : "en-US",
						{
							year: "numeric",
							month: "short",
							day: "numeric",
						},
					)}
				/>
			))}
		</div>
	);
};

import { MenuPost } from "../../molecules/MenuPost/MenuPost";
import { MenuCategories } from "../MenuCategories/MenuCategories";
import { editorsPickPosts } from "./config";
import { labels } from "@/views/labels";
import { getPopularPosts } from "@/utils/services/popularPosts/request";
import { routes } from "@/utils/routes";
import "./menu.css";

export const Menu = async () => {
	const popularPosts = await getPopularPosts();

	return (
		<div className="menu">
			<h2 className="menu__subtitle">{labels.whatsHot}</h2>
			<h1 className="menu__title">{labels.mostPopular}</h1>
			{popularPosts.map((post) => (
				<MenuPost
					key={post.id}
					withImage={true}
					linkHref={routes.post(post.slug, post.catSlug)}
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

			<h2 className="menu__subtitle">{labels.discoverByTopic}</h2>
			<h1 className="menu__title">{labels.categories}</h1>
			<MenuCategories />

			<h2 className="menu__subtitle">{labels.chosenByTheEditor}</h2>
			<h1 className="menu__title">{labels.editorsPick}</h1>
			{editorsPickPosts.map((config) => (
				<MenuPost
					key={config.id}
					withImage={config.withImage}
					linkHref={config.linkHref}
					itemImageSrc={config.itemImageSrc}
					itemImageAlt={config.itemImageAlt}
					categoryTitle={config.categoryTitle}
					text={config.text}
					textName={config.textName}
					textDate={config.textDate}
				/>
			))}
		</div>
	);
};

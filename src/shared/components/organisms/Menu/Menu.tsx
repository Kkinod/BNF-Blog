import { MenuPost } from "../../molecules/MenuPost/MenuPost";
import { MenuCategories } from "../MenuCategories/MenuCategories";
import { labels } from "@/shared/utils/labels";
import { getPopularPosts } from "@/features/blog/api/popularPosts/request";
import { getPickPosts } from "@/features/blog/api/pickPosts/request";
import { routes } from "@/shared/utils/routes";
import "./menu.css";

export const Menu = async () => {
	const popularPosts = await getPopularPosts();
	const pickPosts = await getPickPosts();

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
			{pickPosts.map((post) => (
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
		</div>
	);
};

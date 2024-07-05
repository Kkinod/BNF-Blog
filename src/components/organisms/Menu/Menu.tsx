import { MenuPost } from "../../molecules/MenuPost/MenuPost";
import { MenuCategories } from "../MenuCategories/MenuCategories";
import { editorsPickPosts, mostPopularPosts } from "./config";
import { labels } from "@/views/labels";
import "./menu.css";

export const Menu = () => {
	return (
		<div className="menu">
			<h2 className="menu__subtitle">{labels.whatsHot}</h2>
			<h1 className="menu__title">{labels.mostPopular}</h1>
			{mostPopularPosts.map((config) => (
				<MenuPost
					key={config.id}
					withImage={config.withImage}
					linkHref={config.linkHref}
					categoryTitle={config.categoryTitle}
					text={config.text}
					textName={config.textName}
					textDate={config.textDate}
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

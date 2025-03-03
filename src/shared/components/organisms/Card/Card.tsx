import Image from "next/image";
import Link from "next/link";
import defaultImage from "../../../../../public/defaultImgPost.webp";
import { type Posts } from "@/app/api/posts/route";
import { labels } from "@/shared/utils/labels";
import { CategoryItem } from "@/shared/components/atoms/CategoryItem/CategoryItem";
import { routes } from "@/shared/utils/routes";
import "./card.css";

export interface PostCard extends Omit<Posts, "createdAt"> {
	createdAt: string;
}

export const Card = ({ item }: { item: PostCard }) => {
	return (
		<div className="post__wrapper">
			<Link href={routes.post(item.slug, item.catSlug)} className="post__imageContainer">
				<Image src={item.img || defaultImage} alt="main post photo" fill className="post__image" />
				<div className="textContainer">
					<CategoryItem category={item.catSlug} />
					<h1 className="textContainer__title">{item.title}</h1>
					<div className="mt-8 flex justify-between">
						<div className="textContainer__link">{labels.readMore}</div>
						<span className="textContainer__date">{item.createdAt.substring(0, 10)}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

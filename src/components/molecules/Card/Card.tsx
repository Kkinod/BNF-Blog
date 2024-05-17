import xss from "xss";
import Image from "next/image";
import Link from "next/link";
import { type Posts } from "@/app/api/posts/route";
import "./card.css";

export interface PostCard extends Omit<Posts, "createdAt"> {
	createdAt: string;
}

export const Card = ({ item }: { item: PostCard }) => {
	const trimmedRawText = item?.desc.substring(0, 60);
	const cleanHtml: string = xss(trimmedRawText);

	return (
		<div className="card">
			{item.img && (
				<div className="post__imageContainer">
					<Image src={item.img} alt="" fill className="post__image" />
				</div>
			)}
			<div className="post__textContainer">
				<div className="post__details">
					<span className="post__date">{item.createdAt.substring(0, 10)} - </span>
					<span className="post__category">{item.catSlug}</span>
				</div>
				<Link href={`/posts/${item.slug}`}>
					<h1>{item.title}</h1>
				</Link>
				<div className="content__postDescription" dangerouslySetInnerHTML={{ __html: cleanHtml }} />
				<Link href={`/posts/${item.slug}`} className="post__link">
					Read More
				</Link>
			</div>
		</div>
	);
};

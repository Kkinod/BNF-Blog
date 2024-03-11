import Image from "next/image";
import Link from "next/link";
import { type Posts } from "@/app/api/posts/route";
import "./card.css";

export const Card = ({ item }: { item: Posts }) => {
	return (
		<div className="card">
			<div className="post__imageContainer">
				<Image src="/p1.jpeg" alt="" fill className="post__image" />
			</div>
			<div className="post__textContainer">
				<div className="post__details">
					<span className="post__date">11.02.2023 - </span>
					<span className="post__category">CULTURE</span>
				</div>
				<Link href="/">
					<h1>{item.title}</h1>
				</Link>
				<p className="post__description">
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum, consequatur accusamus
					consectetur reprehenderit facilis dolor quas dolorem vitae porro ullam ut inventore ipsam
					ex ad hic beatae assumenda magni quasi...
				</p>
				<Link href="/" className="post__link">
					Read More
				</Link>
			</div>
		</div>
	);
};

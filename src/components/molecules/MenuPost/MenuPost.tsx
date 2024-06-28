import Image from "next/image";
import Link from "next/link";
import "./menuPost.css";
import { CategoryItem } from "@/components/atoms/CategoryItem/CategoryItem";

export interface MenuPostProps {
	linkHref: string;
	withImage: boolean;
	itemImageSrc?: string;
	itemImageAlt?: string;
	categoryTitle: string;
	text: string;
	textName: string;
	textDate: string;
}

export const MenuPost = ({
	withImage,
	linkHref,
	itemImageSrc,
	itemImageAlt,
	categoryTitle,
	text,
	textName,
	textDate,
}: MenuPostProps) => {
	return (
		<div className="menu__itemsContainer">
			<Link href={linkHref} className="menu__item">
				{withImage && itemImageSrc && itemImageAlt && (
					<div className="item__imageContainer">
						<Image src={itemImageSrc} alt={itemImageAlt} fill className="item__image" />
					</div>
				)}
				<div className="item__textContainer">
					<CategoryItem category={categoryTitle} />
					<h3 className="item__textPostTitle">{text}</h3>
					<div className="item__textDetails">
						<span className="item__textName">{textName}</span>
						<span className="item__textDate">{" - " + textDate}</span>
					</div>
				</div>
			</Link>
		</div>
	);
};

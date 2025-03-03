import { type MenuPostProps } from "../../molecules/MenuPost/MenuPost";

interface MenuPostsConfig extends MenuPostProps {
	id: number;
}

export const editorsPickPosts: MenuPostsConfig[] = [
	{
		id: 1,
		withImage: true,
		linkHref: "/",
		itemImageSrc: "/p1.jpeg",
		itemImageAlt: "image",
		categoryTitle: "Travel",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
	{
		id: 2,
		withImage: true,
		linkHref: "/",
		itemImageSrc: "/p1.jpeg",
		itemImageAlt: "image",
		categoryTitle: "Food",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
	{
		id: 3,
		withImage: true,
		linkHref: "/",
		itemImageSrc: "/p1.jpeg",
		itemImageAlt: "image",
		categoryTitle: "Coding",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
];

export const mostPopularPosts: MenuPostsConfig[] = [
	{
		id: 1,
		withImage: false,
		linkHref: "/",
		categoryTitle: "Travel",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
	{
		id: 2,
		withImage: false,
		linkHref: "/",
		categoryTitle: "Food",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
	{
		id: 3,
		withImage: false,
		linkHref: "/",
		categoryTitle: "Coding",
		text: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
		textName: "John Doe",
		textDate: "10.03.2023",
	},
];

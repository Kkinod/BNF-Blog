"use client";

import "./categoryItem.css";
import { useRouter } from "next/navigation";
import { routes } from "@/shared/utils/routes";

export const CategoryItem = ({ category }: { category: string }) => {
	const router = useRouter();

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		e.preventDefault();
		router.push(routes.category(category));
	};

	return (
		<button
			onClick={handleClick}
			className={`item__textCategory category--${category.toLowerCase()}`}
		>
			{category}
		</button>
	);
};

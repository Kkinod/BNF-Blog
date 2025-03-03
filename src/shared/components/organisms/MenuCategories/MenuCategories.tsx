import Link from "next/link";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { routes } from "@/shared/utils/routes";
import "./menuCategories.css";

export const MenuCategories = async () => {
	const data = await getDataCategoriesServer();

	return (
		<div className="menu__categoryList">
			{data.map((item) => (
				<Link
					key={item.id}
					href={routes.category(item.slug)}
					className={`category__item category--${item.slug}`}
				>
					{item.title}
				</Link>
			))}
		</div>
	);
};

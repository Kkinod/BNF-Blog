import "./categoryItem.css";

export const CategoryItem = ({ category }: { category: string }) => {
	return (
		<span className={`item__textCategory category--${category.toLowerCase()}`}>{category}</span>
	);
};

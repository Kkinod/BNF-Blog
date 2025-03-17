import { useState } from "react";
import { labels } from "@/shared/utils/labels";
import { type Category } from "@/app/api/categories/route";

interface CategorySelectorProps {
	categories: Category[];
	isLoading: boolean;
	selectedCategory: string;
	onSelectCategory: (slug: string) => void;
	hasError: boolean;
}

export const CategorySelector = ({
	categories,
	isLoading,
	selectedCategory,
	onSelectCategory,
	hasError,
}: CategorySelectorProps) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	return (
		<div className="writePage__dropdownContainer">
			<div className="writePage__dropdown">
				<button
					className={`writePage__dropdown-button ${hasError ? "writePage__dropdown-button--error" : ""}`}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
					disabled={isLoading}
					style={selectedCategory ? { color: `var(--category-${selectedCategory})` } : undefined}
				>
					{isLoading
						? labels.loading
						: selectedCategory
							? categories.find((cat) => cat.slug === selectedCategory)?.title
							: labels.selectCategory}
				</button>
				{isDropdownOpen && !isLoading && (
					<div className="writePage__dropdown-content">
						{categories.map((category) => (
							<div
								key={category.id}
								className="writePage__dropdown-item"
								onClick={() => {
									onSelectCategory(category.slug);
									setIsDropdownOpen(false);
								}}
								style={{ color: `var(--category-${category.slug})` }}
							>
								{category.title}
							</div>
						))}
					</div>
				)}
			</div>
			{hasError && <span className="writePage__error">{labels.errors.categoryRequired}</span>}
		</div>
	);
};

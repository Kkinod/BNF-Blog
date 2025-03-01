import { labels } from "@/views/labels";
import { type Category } from "@/app/api/categories/route";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

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
	return (
		<div className="writePage__dropdownContainer">
			{isLoading ? (
				<div className="writePage__loading">{labels.loading}</div>
			) : (
				<Select value={selectedCategory} onValueChange={onSelectCategory}>
					<SelectTrigger
						className={hasError ? "border-error" : ""}
						style={selectedCategory ? { color: `var(--category-${selectedCategory})` } : undefined}
					>
						<SelectValue placeholder={labels.selectCategory} />
					</SelectTrigger>
					<SelectContent>
						{categories.map((category) => (
							<SelectItem
								key={category.id}
								value={category.slug}
								style={{ color: `var(--category-${category.slug})` }}
							>
								{category.title}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)}
			{hasError && <span className="writePage__error">{labels.errors.categoryRequired}</span>}
		</div>
	);
};

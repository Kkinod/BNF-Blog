import type { SortOption, VisibilityFilter, PickFilter } from "./types";
import type { ListPost } from "@/app/api/posts/route";
import { Badge } from "@/shared/components/ui/badge";
import { Input } from "@/shared/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { labels } from "@/shared/utils/labels";
import { useClientTranslation } from "@/i18n/client-hooks";

interface PostFiltersProps {
	posts: ListPost[];
	sortBy: SortOption;
	setSortBy: (value: SortOption) => void;
	searchQuery: string;
	setSearchQuery: (value: string) => void;
	visibilityFilter: VisibilityFilter;
	setVisibilityFilter: (value: VisibilityFilter) => void;
	categoryFilter: string[];
	setCategoryFilter: (value: string[]) => void;
	filteredCount: number;
	pickedPostsCount: number;
	pickFilter: PickFilter;
	setPickFilter: (value: PickFilter) => void;
}

export const PostFilters = ({
	posts,
	sortBy,
	setSortBy,
	searchQuery,
	setSearchQuery,
	visibilityFilter,
	setVisibilityFilter,
	categoryFilter,
	setCategoryFilter,
	filteredCount,
	pickedPostsCount,
	pickFilter,
	setPickFilter,
}: PostFiltersProps) => {
	const { t } = useClientTranslation();
	const uniqueCategories = Array.from(new Set(posts.map((post) => post.catSlug)));
	const isFiltering = searchQuery || visibilityFilter !== null || categoryFilter.length > 0;

	const toggleCategory = (category: string) => {
		setCategoryFilter(
			categoryFilter.includes(category)
				? categoryFilter.filter((cat) => cat !== category)
				: [...categoryFilter, category],
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">
					{t("admin.posts.list", { defaultValue: labels.posts.list })}
				</h2>
				<Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue
							placeholder={t("admin.posts.sortBy", { defaultValue: labels.posts.sortBy })}
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">
							{t("admin.posts.newest", { defaultValue: labels.posts.newest })}
						</SelectItem>
						<SelectItem value="oldest">
							{t("admin.posts.oldest", { defaultValue: labels.posts.oldest })}
						</SelectItem>
						<SelectItem value="most-viewed">
							{t("admin.posts.mostViewed", { defaultValue: labels.posts.mostViewed })}
						</SelectItem>
						<SelectItem value="least-viewed">
							{t("admin.posts.leastViewed", { defaultValue: labels.posts.leastViewed })}
						</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div className="flex gap-2">
					<span>
						{t("admin.posts.total", { defaultValue: labels.posts.total })}: {posts.length}
					</span>
					{isFiltering && (
						<span>
							• {t("admin.posts.filtered", { defaultValue: labels.posts.filtered })}:{" "}
							{filteredCount}
						</span>
					)}
					<span>
						• {t("admin.posts.selected", { defaultValue: labels.posts.pick })}: {pickedPostsCount}/3
					</span>
				</div>
				<span>
					{t("admin.posts.visible", { defaultValue: labels.posts.visible })}:{" "}
					{posts.filter((post) => post.isVisible).length}
				</span>
			</div>

			<div className="space-y-2">
				<div className="flex flex-wrap gap-2">
					<Badge
						variant={visibilityFilter === "visible" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setVisibilityFilter(visibilityFilter === "visible" ? null : "visible")}
					>
						{t("admin.posts.onlyVisible", { defaultValue: labels.posts.onlyVisible })}
					</Badge>
					<Badge
						variant={visibilityFilter === "hidden" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setVisibilityFilter(visibilityFilter === "hidden" ? null : "hidden")}
					>
						{t("admin.posts.onlyHidden", { defaultValue: labels.posts.onlyHidden })}
					</Badge>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge
						variant={pickFilter === "picked" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setPickFilter(pickFilter === "picked" ? null : "picked")}
					>
						{t("admin.posts.onlyPicked", { defaultValue: labels.posts.onlyPicked })}
					</Badge>
					<Badge
						variant={pickFilter === "unpicked" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setPickFilter(pickFilter === "unpicked" ? null : "unpicked")}
					>
						{t("admin.posts.onlyUnpicked", { defaultValue: labels.posts.onlyUnpicked })}
					</Badge>
				</div>

				<div className="flex flex-wrap gap-2">
					{uniqueCategories.map((category) => (
						<Badge
							key={category}
							variant={categoryFilter.includes(category) ? "default" : "outline"}
							className="cursor-pointer"
							onClick={() => toggleCategory(category)}
						>
							{t(`categories.${category}`, { defaultValue: category })}
						</Badge>
					))}
				</div>
			</div>

			<Input
				placeholder={t("admin.posts.search", { defaultValue: labels.posts.search })}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="max-w-full"
			/>
		</div>
	);
};

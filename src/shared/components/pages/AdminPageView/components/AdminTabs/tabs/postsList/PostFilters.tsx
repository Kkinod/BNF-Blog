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
				<h2 className="text-2xl font-semibold">{labels.posts.list}</h2>
				<Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder={labels.posts.sortBy} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="newest">{labels.posts.newest}</SelectItem>
						<SelectItem value="oldest">{labels.posts.oldest}</SelectItem>
						<SelectItem value="most-viewed">{labels.posts.mostViewed}</SelectItem>
						<SelectItem value="least-viewed">{labels.posts.leastViewed}</SelectItem>
					</SelectContent>
				</Select>
			</div>

			<div className="flex items-center justify-between text-sm text-muted-foreground">
				<div className="flex gap-2">
					<span>
						{labels.posts.total}: {posts.length}
					</span>
					{isFiltering && (
						<span>
							• {labels.posts.filtered}: {filteredCount}
						</span>
					)}
					<span>
						• {labels.posts.pick}: {pickedPostsCount}/3
					</span>
				</div>
				<span>
					{labels.posts.visible}: {posts.filter((post) => post.isVisible).length}
				</span>
			</div>

			<div className="space-y-2">
				<div className="flex flex-wrap gap-2">
					<Badge
						variant={visibilityFilter === "visible" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setVisibilityFilter(visibilityFilter === "visible" ? null : "visible")}
					>
						{labels.posts.onlyVisible}
					</Badge>
					<Badge
						variant={visibilityFilter === "hidden" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setVisibilityFilter(visibilityFilter === "hidden" ? null : "hidden")}
					>
						{labels.posts.onlyHidden}
					</Badge>
				</div>

				<div className="flex flex-wrap gap-2">
					<Badge
						variant={pickFilter === "picked" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setPickFilter(pickFilter === "picked" ? null : "picked")}
					>
						{labels.posts.onlyPicked}
					</Badge>
					<Badge
						variant={pickFilter === "unpicked" ? "default" : "outline"}
						className="cursor-pointer"
						onClick={() => setPickFilter(pickFilter === "unpicked" ? null : "unpicked")}
					>
						{labels.posts.onlyUnpicked}
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
							{category}
						</Badge>
					))}
				</div>
			</div>

			<Input
				placeholder={labels.posts.search}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className="max-w-full"
			/>
		</div>
	);
};

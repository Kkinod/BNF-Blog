"use client";

import { useEffect, useState } from "react";
import { type Posts } from "@/app/api/posts/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { labels } from "@/views/labels";
import { fetchPosts, togglePostVisibility } from "@/utils/services/posts/request";
import { Badge } from "@/components/ui/badge";

type SortOption = "newest" | "oldest" | "most-viewed" | "least-viewed";
type VisibilityFilter = "all" | "visible" | "hidden";
type CategoryFilter = string[];

export const PostsLists = () => {
	const [posts, setPosts] = useState<Posts[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
	const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>([]);

	useEffect(() => {
		const loadPosts = async () => {
			setIsLoading(true);
			const data = await fetchPosts();
			setPosts(data);
			setIsLoading(false);
		};

		void loadPosts();
	}, []);

	const handleToggleVisibility = async (post: Posts) => {
		const success = await togglePostVisibility(post);
		if (success) {
			const updatedPosts = await fetchPosts();
			setPosts(updatedPosts);
		}
	};

	const sortPosts = (posts: Posts[]) => {
		switch (sortBy) {
			case "newest":
				return [...posts].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
			case "oldest":
				return [...posts].sort(
					(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
				);
			case "most-viewed":
				return [...posts].sort((a, b) => b.views - a.views);
			case "least-viewed":
				return [...posts].sort((a, b) => a.views - b.views);
			default:
				return posts;
		}
	};

	const uniqueCategories = Array.from(new Set(posts.map((post) => post.catSlug)));

	const filteredAndSortedPosts = sortPosts(
		posts.filter((post) => {
			const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesVisibility =
				visibilityFilter === "all"
					? true
					: visibilityFilter === "visible"
						? post.isVisible
						: !post.isVisible;
			const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(post.catSlug);

			return matchesSearch && matchesVisibility && matchesCategory;
		}),
	);

	const isFiltering = searchQuery || visibilityFilter !== "all" || categoryFilter.length > 0;

	const toggleCategory = (category: string) => {
		setCategoryFilter((prev) =>
			prev.includes(category) ? prev.filter((cat) => cat !== category) : [...prev, category],
		);
	};

	return (
		<Card className="w-full">
			<CardHeader>
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
									• {labels.posts.filtered}: {filteredAndSortedPosts.length}
								</span>
							)}
						</div>
						<span>
							{labels.posts.visible}: {posts.filter((post) => post.isVisible).length}
						</span>
					</div>

					<div className="space-y-2">
						<div className="flex flex-wrap gap-2">
							<Badge
								variant={visibilityFilter === "all" ? "default" : "outline"}
								className="cursor-pointer"
								onClick={() => setVisibilityFilter("all")}
							>
								{labels.posts.allPosts}
							</Badge>
							<Badge
								variant={visibilityFilter === "visible" ? "default" : "outline"}
								className="cursor-pointer"
								onClick={() => setVisibilityFilter("visible")}
							>
								{labels.posts.onlyVisible}
							</Badge>
							<Badge
								variant={visibilityFilter === "hidden" ? "default" : "outline"}
								className="cursor-pointer"
								onClick={() => setVisibilityFilter("hidden")}
							>
								{labels.posts.onlyHidden}
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
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center">{labels.loading}</div>
				) : (
					<div className="custom-scrollbar max-h-[60vh] divide-y overflow-y-auto">
						{filteredAndSortedPosts.map((post) => (
							<div key={post.id} className="py-4">
								<div className="flex flex-row items-center justify-between xs:flex-col xs:items-start xs:gap-4">
									<div>
										<h3 className="text-lg font-medium">{post.title}</h3>
										<p className="text-sm text-muted-foreground">
											{new Date(post.createdAt).toLocaleDateString()}
										</p>
										<p className="text-sm text-muted-foreground">
											{labels.posts.category}: {post.catSlug}
										</p>
										<p className="text-sm text-muted-foreground">
											{labels.posts.views}: {post.views}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											variant={post.isVisible ? "outline" : "secondary"}
											size="sm"
											onClick={() => handleToggleVisibility(post)}
										>
											{post.isVisible ? labels.posts.hide : labels.posts.show}
										</Button>
										<Button variant="destructive" size="sm">
											{labels.posts.delete}
										</Button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

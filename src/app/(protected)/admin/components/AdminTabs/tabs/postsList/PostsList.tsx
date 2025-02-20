"use client";

import { useEffect, useState } from "react";
import { PostFilters } from "./PostFilters";
import { PostItem } from "./PostItem";
import type { SortOption, VisibilityFilter, CategoryFilter } from "./types";
import type { Posts } from "@/app/api/posts/route";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { labels } from "@/views/labels";
import { fetchPosts, togglePostVisibility } from "@/utils/services/posts/request";

export const PostsList = () => {
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

	const sortPosts = (postsToSort: Posts[]) => {
		switch (sortBy) {
			case "newest":
				return [...postsToSort].sort(
					(a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
				);
			case "oldest":
				return [...postsToSort].sort(
					(a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
				);
			case "most-viewed":
				return [...postsToSort].sort((a, b) => b.views - a.views);
			case "least-viewed":
				return [...postsToSort].sort((a, b) => a.views - b.views);
			default:
				return postsToSort;
		}
	};

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

	return (
		<Card className="w-full">
			<CardHeader>
				<PostFilters
					posts={posts}
					sortBy={sortBy}
					setSortBy={setSortBy}
					searchQuery={searchQuery}
					setSearchQuery={setSearchQuery}
					visibilityFilter={visibilityFilter}
					setVisibilityFilter={setVisibilityFilter}
					categoryFilter={categoryFilter}
					setCategoryFilter={setCategoryFilter}
					filteredCount={filteredAndSortedPosts.length}
				/>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center">{labels.loading}</div>
				) : (
					<div className="custom-scrollbar max-h-[60vh] divide-y overflow-y-auto">
						{filteredAndSortedPosts.map((post) => (
							<PostItem key={post.id} post={post} onToggleVisibility={handleToggleVisibility} />
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

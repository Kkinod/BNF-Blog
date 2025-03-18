"use client";

import { useEffect, useState } from "react";
import { PostFilters } from "./PostFilters";
import { PostItem } from "./PostItem";
import type { SortOption, VisibilityFilter, CategoryFilter, PickFilter } from "./types";
import type { ListPost } from "@/app/api/posts/route";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
	fetchPosts,
	togglePostVisibility,
	togglePostPick,
	deletePost,
} from "@/features/blog/api/posts/request";
import { SimpleLoader } from "@/shared/components/organisms/SimpleLoader";

export const PostsList = () => {
	const [posts, setPosts] = useState<ListPost[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isLoadingVisibility, setIsLoadingVisibility] = useState(false);
	const [isLoadingDelete, setIsLoadingDelete] = useState(false);
	const [sortBy, setSortBy] = useState<SortOption>("newest");
	const [searchQuery, setSearchQuery] = useState("");
	const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>(null);
	const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>([]);
	const [pickFilter, setPickFilter] = useState<PickFilter>(null);
	const pickedPostsCount = posts.filter((post) => post.isPick).length;
	const remainingPicks = 3 - pickedPostsCount;

	useEffect(() => {
		const loadPosts = async () => {
			setIsLoading(true);
			const data = await fetchPosts();
			setPosts(data);
			setIsLoading(false);
		};

		void loadPosts();
	}, []);

	const handleToggleVisibility = async (post: ListPost) => {
		setIsLoadingVisibility(true);
		try {
			const success = await togglePostVisibility(post);
			if (success) {
				const updatedPosts = await fetchPosts();
				setPosts(updatedPosts);
			}
		} finally {
			setIsLoadingVisibility(false);
		}
	};

	const handleTogglePick = async (post: ListPost) => {
		setIsLoadingVisibility(true);
		try {
			const success = await togglePostPick(post);
			if (success) {
				const updatedPosts = await fetchPosts();
				setPosts(updatedPosts);
			}
		} finally {
			setIsLoadingVisibility(false);
		}
	};

	const handleDeletePost = async (post: ListPost) => {
		setIsLoadingDelete(true);
		try {
			const success = await deletePost(post.id);
			if (success) {
				const updatedPosts = await fetchPosts();
				setPosts(updatedPosts);
			}
		} finally {
			setIsLoadingDelete(false);
		}
	};

	const sortPosts = (postsToSort: ListPost[]) => {
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
				!visibilityFilter || (visibilityFilter === "visible" ? post.isVisible : !post.isVisible);
			const matchesPick = !pickFilter || (pickFilter === "picked" ? post.isPick : !post.isPick);
			const matchesCategory = categoryFilter.length === 0 || categoryFilter.includes(post.catSlug);

			return matchesSearch && matchesVisibility && matchesPick && matchesCategory;
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
					pickFilter={pickFilter}
					setPickFilter={setPickFilter}
					filteredCount={filteredAndSortedPosts.length}
					pickedPostsCount={pickedPostsCount}
				/>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<SimpleLoader />
				) : (
					<div className="custom-scrollbar max-h-[60vh] divide-y overflow-y-auto">
						{filteredAndSortedPosts.map((post) => (
							<PostItem
								key={post.id}
								post={post}
								onToggleVisibility={handleToggleVisibility}
								onTogglePick={handleTogglePick}
								onDeletePost={handleDeletePost}
								isDisabled={isLoadingVisibility || isLoadingDelete}
								remainingPicks={remainingPicks}
							/>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};

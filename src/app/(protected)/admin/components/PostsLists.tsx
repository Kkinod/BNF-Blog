"use client";

import { useEffect, useState } from "react";
import { type Posts } from "@/app/api/posts/route";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { labels } from "@/views/labels";
import { fetchPosts, togglePostVisibility } from "@/utils/services/posts/request";

type SortOption = "newest" | "oldest" | "most-viewed" | "least-viewed";

export const PostsLists = () => {
	const [posts, setPosts] = useState<Posts[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [sortBy, setSortBy] = useState<SortOption>("newest");

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

	const sortedPosts = sortPosts(posts);

	return (
		<Card className="w-full max-w-[600px]">
			<CardHeader>
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
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="text-center">{labels.loading}</div>
				) : (
					<div className="custom-scrollbar max-h-[60vh] divide-y overflow-y-auto">
						{sortedPosts.map((post) => (
							<div key={post.id} className="py-4">
								<div className="flex items-center justify-between">
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

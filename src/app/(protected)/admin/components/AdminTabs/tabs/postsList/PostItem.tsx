import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { labels } from "@/views/labels";
import { type Posts } from "@/app/api/posts/route";

interface PostItemProps {
	post: Posts;
	onToggleVisibility: (post: Posts) => Promise<void>;
	isDisabled: boolean;
}

export const PostItem = ({ post, onToggleVisibility, isDisabled }: PostItemProps) => {
	return (
		<div className="py-4">
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
						onClick={() => onToggleVisibility(post)}
						disabled={isDisabled}
					>
						{post.isVisible ? labels.posts.hide : labels.posts.show}
					</Button>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div>
									<Button variant="destructive" size="sm" disabled>
										{labels.posts.delete}
									</Button>
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>{labels.posts.deleteNotAvailable}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			</div>
		</div>
	);
};

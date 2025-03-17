import { type Metadata } from "next";
import { labels } from "@/shared/utils/labels";
import { PostFormView } from "@/shared/components/pages/PostFormView/PostFormView";

export const metadata: Metadata = {
	title: labels.metadata.editPost.title,
	description: labels.metadata.editPost.description,
};

interface EditPostPageProps {
	params: {
		id: string;
	};
}

export default function EditPostPage({ params }: EditPostPageProps) {
	return <PostFormView postId={params.id} mode="edit" />;
}

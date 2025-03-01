"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { TitleInput } from "./components/TitleInput";
import { CategorySelector } from "./components/CategorySelector";
import { MediaUploader } from "./components/MediaUploader";
import { ContentEditor } from "./components/ContentEditor";
import { PublishButton } from "./components/PublishButton";
import { type Category } from "@/app/api/categories/route";
import { getDataCategories } from "@/utils/services/categories/request";
import { useImageUpload } from "@/hooks/useImageUpload";
import { usePostForm } from "@/hooks/usePostForm";
import { labels } from "@/views/labels";
import "./writePage.css";

export const WritePageView = () => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	const { status } = useSession();

	const { setFile, imageUrl, uploadProgress, isUploading, resetUpload, cancelUpload } =
		useImageUpload();

	const {
		title,
		content,
		categorySlug,
		errors,
		setTitle,
		setContent,
		setCategorySlug,
		handleSubmit,
	} = usePostForm(imageUrl);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await getDataCategories();
				setCategories(categoriesData);
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("[DEV] Error fetching categories:", error);
				}
				toast.error(labels.errors.somethingWentWrong);
			} finally {
				setIsLoadingCategories(false);
			}
		};

		void fetchCategories();
	}, []);

	if (status === "loading") {
		return <div className="loading">{labels.loading}</div>;
	}

	if (status === "unauthenticated") {
		return <div className="unauthorized">{labels.writePost.unauthorized}</div>;
	}

	return (
		<div className="writePage__container">
			<div className="writePage__card">
				<div className="writePage__header">
					<h1 className="writePage__title">{labels.writePost.pageTitle}</h1>
				</div>

				<div className="writePage__content">
					<div className="writePage__section">
						<TitleInput title={title} onTitleChange={setTitle} hasError={errors.title} />
						<CategorySelector
							categories={categories}
							isLoading={isLoadingCategories}
							selectedCategory={categorySlug}
							onSelectCategory={setCategorySlug}
							hasError={errors.category}
						/>
					</div>

					<div className="writePage__section">
						<div className="writePage__editorContainer">
							<MediaUploader
								setFile={setFile}
								imageUrl={imageUrl}
								uploadProgress={uploadProgress}
								isUploading={isUploading}
								resetUpload={resetUpload}
								cancelUpload={cancelUpload}
							/>
							<ContentEditor
								content={content}
								onContentChange={setContent}
								hasError={errors.content}
							/>
						</div>
					</div>
				</div>

				<div className="writePage__footer">
					<PublishButton onPublish={handleSubmit} disabled={isUploading} />
				</div>
			</div>
		</div>
	);
};

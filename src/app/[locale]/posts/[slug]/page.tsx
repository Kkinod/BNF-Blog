import Image from "next/image";
import xss from "xss";
import { notFound } from "next/navigation";
import defaultImgPost from "../../../../../public/defaultImgPost.webp";
import { Comments } from "@/shared/components/organisms/Comments/Comments";
import { getDataSinglePost } from "@/features/blog/api/singlePost/request";
import { labels } from "@/shared/utils/labels";
import { xssOptions } from "@/shared/utils/xss-config";
import { formatDate } from "@/shared/utils/formatters";
import "./singlePage.css";
import { getTranslations } from "@/shared/utils/translations";

interface Params {
	slug: string;
	locale: string;
}

interface Props {
	params: Params;
	searchParams: { cat: string };
}

const SinglePage = async ({ params, searchParams }: Props) => {
	const { slug, locale } = params;
	const { cat } = searchParams;
	const t = await getTranslations(locale);
	let data;

	try {
		data = await getDataSinglePost(slug);

		if (cat !== data.catSlug) {
			notFound();
		}
	} catch (error) {
		return (
			<div className="flex flex-1 items-center justify-center text-[2rem]">
				{labels.errors.postNotFound}
			</div>
		);
	}

	const cleanHtml: string = xss(data?.desc, xssOptions);

	return (
		<div className="singlePage">
			<div className="singlePage__titleWrapper">
				<div className="text__userTextContainer">
					<span className="text__userDate">
						{formatDate(data?.createdAt, "long", locale).toUpperCase()}
					</span>
				</div>
				<h1 className="singlePage__textTitle">{data?.title}</h1>
				<div className="singlePage__category" style={{ color: `var(--category-${data?.catSlug})` }}>
					{t(`categories.${data?.catSlug}`, { defaultValue: data.catSlug })}
				</div>
				<div className="singlePage__textTitle_divider" />
			</div>
			<div className="singlePage__post">
				<div className="singlePage__infoContainer">
					<div className="singlePage__imageContainer">
						<Image
							src={data?.img || defaultImgPost}
							alt="post image"
							width={1200}
							height={600}
							className="singlePage__image"
						/>
					</div>
				</div>
				<div className="singlePage__content">
					<div className="content__post ql-snow">
						<div
							className="content__postDescription ql-editor"
							dangerouslySetInnerHTML={{ __html: cleanHtml }}
						/>
						<div className="content__comment">
							<Comments postSlug={slug} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SinglePage;

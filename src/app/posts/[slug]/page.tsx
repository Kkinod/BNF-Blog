import Image from "next/image";
import xss from "xss";
import { notFound } from "next/navigation";
import defaultImgPost from "../../../../public/defaultImgPost.webp";
import { Comments } from "@/components/molecules/Comments/Comments";
import { getDataSinglePost } from "@/utils/services/singlePost/request";
import { labels } from "@/views/labels";
import "./singlePage.css";

interface Params {
	slug: string;
}

interface Props {
	params: Params;
	searchParams: { cat: string };
}

const SinglePage = async ({ params, searchParams }: Props) => {
	const { slug } = params;
	const { cat } = searchParams;
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

	const formatDate = (dateString: string) => {
		const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short", day: "numeric" };

		return new Date(dateString).toLocaleDateString("en-US", options);
	};

	const cleanHtml: string = xss(data?.desc);

	return (
		<div className="singlePage">
			<div className="singlePage__titleWrapper">
				<div className="text__userTextContainer">
					<span className="text__userDate">{formatDate(data?.createdAt).toUpperCase()}</span>
				</div>
				<h1 className="singlePage__textTitle">{data?.title}</h1>
				<div className="singlePage__category" style={{ color: `var(--category-${data?.catSlug})` }}>
					{data?.catSlug}
				</div>
				<div className="singlePage__textTitle_divider" />
			</div>
			<div className="singlePage__post">
				<div className="singlePage__infoContainer">
					<div className="singlePage__imageContainer">
						<Image
							src={data?.img || defaultImgPost}
							alt="post image"
							layout="responsive"
							width={700}
							height={475}
							className="singlePage__image"
						/>
					</div>
				</div>
				<div className="singlePage__content">
					<div className="content__post">
						<div
							className="content__postDescription"
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

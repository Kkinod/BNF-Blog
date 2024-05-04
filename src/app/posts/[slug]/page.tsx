import Image from "next/image";
import xss from "xss";
import { Menu } from "@/components/organisms/Menu/Menu";
import { Comments } from "@/components/molecules/Comments/Comments";
import { getDataSinglePost } from "@/utils/services/singlePost/request";
import { labels } from "@/views/labels";
import "./singlePage.css";

interface Params {
	slug: string;
}

const SinglePage = async ({ params }: { params: Params }) => {
	const { slug } = params;

	let data;

	try {
		data = await getDataSinglePost(slug);
	} catch (error) {
		return (
			<div className="flex flex-1 items-center justify-center text-[2rem]">
				{labels.errors.postNotFound}
			</div>
		);
	}

	const cleanHtml: string = xss(data?.desc);

	return (
		<div className="singlePage">
			<div className="singlePage__infoContainer">
				<div className="singlePage__textContainer">
					<h1 className="singlePage__textTitle">{data?.title}</h1>
					<div className="text__userContainer">
						{data?.user?.image && (
							<div className="text__userImageContainer">
								<Image src={data.user.image} alt="" fill className="singlePage__imageAvatar" />
							</div>
						)}
						<div className="text__userTextContainer">
							<span className="text__userName">{data?.user.name}</span>
							<span className="text__userDate">{data.createdAt.substring(0, 10)}</span>
						</div>
					</div>
				</div>
				{data?.img && (
					<div className="singlePage__imageContainer">
						<Image src={data.img} alt="" fill className="singlePage__image" />
					</div>
				)}
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
				<Menu />
			</div>
		</div>
	);
};

export default SinglePage;

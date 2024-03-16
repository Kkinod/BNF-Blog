import Image from "next/image";
import { Menu } from "@/components/Menu/Menu";
import { Comments } from "@/components/ATOMIC_DESIGN/molecules/Comments/Comments";
import "./singlePage.css";
import { type Posts } from "@/app/api/posts/route";

export interface User {
	id: string;
	name: string;
	email: string;
	emailVerified: string | null;
	image: string;
}

interface PromiseGetData extends Posts {
	user: User;
}

interface Params {
	slug: string;
}

const getData = async (slug: string): Promise<PromiseGetData> => {
	const res = await fetch(`http://localhost:3000/api/posts/${slug}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as PromiseGetData;
	return data;
};

const SinglePage = async ({ params }: { params: Params }) => {
	const { slug } = params;

	const data = await getData(slug);

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
							<span className="text__userDate">03.03.2024</span>
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
					{/* add library for more secure "dangerouslySetInnerHTML such as sanitize-html-react" */}
					<div
						className="content__postDescription"
						dangerouslySetInnerHTML={{ __html: data?.desc }}
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

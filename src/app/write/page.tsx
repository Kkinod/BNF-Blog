"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import "react-quill/dist/quill.bubble.css";
import "./writePage.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const WritePage = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [value, setValue] = useState<string>("");

	const { status } = useSession();

	const router = useRouter();

	// useEffect(() => {
	// 	if (status === "authenticated") {
	// 		router.push("/");
	// 	}
	// }, [status, router]);

	// if (status === "loading") {
	// 	return <div className="loading">Loading...</div>;
	// }

	return (
		<div className="writePage__container">
			<input type="text" placeholder="Title" className="writePage__input" />
			<div className="writePage__editor">
				<button className="writePage__button" onClick={() => setOpen(!open)}>
					<Image src="/plus.png" alt="" className="" width={16} height={16} />
				</button>
				{open && (
					<div className="writePage__addButtonsContainer">
						<button className="writePage__addButton">
							<Image src="/image.png" alt="" className="" width={16} height={16} />
						</button>
						<button className="writePage__addButton">
							<Image src="/external.png" alt="" className="" width={16} height={16} />
						</button>
						<button className="writePage__addButton">
							<Image src="/video.png" alt="" className="" width={16} height={16} />
						</button>
					</div>
				)}
				<ReactQuill
					theme="bubble"
					value={value}
					onChange={setValue}
					placeholder="Tell story..."
					className="writePage__textArea"
				/>
			</div>
			<button className="writePage__publish">Publish</button>
		</div>
	);
};

export default WritePage;

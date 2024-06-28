"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { type Posts } from "../api/posts/route";
import { app } from "@/utils/firebase";
import "react-quill/dist/quill.bubble.css";
import "./writePage.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const storage = getStorage(app);

const WritePage = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [file, setFile] = useState<File | null>(null);
	const [media, setMedia] = useState("");
	const [value, setValue] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [catSlug, setCatSlug] = useState("");

	const { status } = useSession();

	const router = useRouter();

	useEffect(() => {
		const upload = () => {
			if (!file) return;

			const fileName = new Date().getTime() + (file?.name || "");
			const storageRef = ref(storage, fileName);

			const uploadTask = uploadBytesResumable(storageRef, file);

			uploadTask.on(
				"state_changed",
				(snapshot) => {
					const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					console.log("Upload is " + progress + "% done");
					switch (snapshot.state) {
						case "paused":
							console.log("Upload is paused");
							break;
						case "running":
							console.log("Upload is running");
							break;
					}
				},
				(error) => {
					console.error("Upload failed:", error);
				},
				() => {
					getDownloadURL(uploadTask.snapshot.ref)
						.then((downloadURL) => {
							setMedia(downloadURL);
						})
						.catch((error) => {
							console.error("Error getting download URL:", error);
						});
				},
			);
		};

		file && upload();
	}, [file]);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		}
	}, [status, router]);

	if (status === "loading") {
		return <div className="loading">Loading...</div>;
	}

	const slugify = (str: string) => {
		const iMap: { [key: string]: string } = {
			ð: "d",
			ı: "i",
			Ł: "L",
			ł: "l",
			ø: "o",
			ß: "ss",
			ü: "ue",
		};

		const iRegex = new RegExp(Object.keys(iMap).join("|"), "g");
		return str
			.replace(iRegex, (m) => iMap[m])
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.toLowerCase()
			.trim()
			.replace(/[^\w\s-]/g, "")
			.replace(/[\s_-]+/g, "-")
			.replace(/^-+|-+$/g, "");
	};

	const handleSubmit = async () => {
		const res = await fetch("/api/posts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				title,
				desc: value,
				img: media,
				slug: slugify(title),
				catSlug: catSlug || "style",
			}),
		});

		const post: Posts = (await res.json()) as Posts;

		if (res.ok && post.slug) {
			router.push(`/posts/${post.slug}`);
		} else {
			console.error("Error submitting the post");
		}
	};

	const handleClick = () => {
		handleSubmit().catch(console.error);
	};

	return (
		<div className="writePage__container">
			<input
				type="text"
				placeholder="Title"
				className="writePage__input"
				onChange={(e) => setTitle(e.target.value)}
			/>
			<select className="writePage__selectCategory" onChange={(e) => setCatSlug(e.target.value)}>
				<option value="style">style</option>
				<option value="fashion">fashion</option>
				<option value="food">food</option>
				<option value="culture">culture</option>
				<option value="travel">travel</option>
				<option value="coding">coding</option>
			</select>
			<div className="writePage__editor">
				<div>
					<button className="writePage__button" onClick={() => setOpen(!open)}>
						<Image src="/plus.png" alt="" className="" width={16} height={16} />
					</button>
				</div>
				{open && (
					<div className="writePage__addButtonsContainer">
						<input
							type="file"
							id="image"
							onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
							style={{ display: "none" }}
						/>
						<button className="writePage__addButton">
							<label htmlFor="image" className="labelek">
								<Image src="/image.png" alt="" className="" width={16} height={16} />
							</label>
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
			<button className="writePage__publish" onClick={handleClick}>
				Publish
			</button>
		</div>
	);
};

export default WritePage;

"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { type Posts } from "../api/posts/route";
import { app } from "@/utils/firebase";
import { type Category } from "@/app/api/categories/route";
import { getDataCategories } from "@/utils/services/categories/request";
import "react-quill/dist/quill.bubble.css";
import "./writePage.css";
import { labels } from "@/views/labels";
import { routes } from "@/utils/routes";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
const storage = getStorage(app);

const WritePage = () => {
	const [open, setOpen] = useState<boolean>(false);
	const [file, setFile] = useState<File | null>(null);
	const [media, setMedia] = useState("");
	const [value, setValue] = useState<string>("");
	const [title, setTitle] = useState<string>("");
	const [catSlug, setCatSlug] = useState("");
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [errors, setErrors] = useState({
		title: false,
		category: false,
		content: false,
	});

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

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await getDataCategories();
				setCategories(categoriesData);
			} catch (error) {
				console.error("Error fetching categories:", error);
			} finally {
				setIsLoadingCategories(false);
			}
		};

		fetchCategories().catch((error) => {
			console.error("Failed to fetch categories:", error);
			setIsLoadingCategories(false);
		});
	}, []);

	if (status === "loading") {
		return <div className="loading">{labels.loading}</div>;
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
		setErrors({
			title: false,
			category: false,
			content: false,
		});

		const newErrors = {
			title: !title.trim(),
			category: !catSlug,
			content: !value.trim(),
		};

		if (Object.values(newErrors).some(Boolean)) {
			setErrors(newErrors);
			return;
		}

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
				catSlug: catSlug,
			}),
		});

		const post: Posts = (await res.json()) as Posts;

		if (res.ok && post.slug) {
			router.push(routes.post(post.slug, catSlug));
		} else {
			console.error("Error submitting the post");
		}
	};

	const handleClick = () => {
		handleSubmit().catch(console.error);
	};

	return (
		<div className="writePage__container">
			<div className="writePage__inputContainer">
				<input
					type="text"
					placeholder="Title"
					className={`writePage__input ${errors.title ? "writePage__input--error" : ""}`}
					onChange={(e) => setTitle(e.target.value)}
				/>
				{errors.title && <span className="writePage__error">{labels.errors.titleRequired}</span>}
			</div>

			<div className="writePage__dropdownContainer">
				<div className="writePage__dropdown">
					<button
						className={`writePage__dropdown-button ${errors.category ? "writePage__dropdown-button--error" : ""}`}
						onClick={() => setIsDropdownOpen(!isDropdownOpen)}
						disabled={isLoadingCategories}
						style={catSlug ? { color: `var(--category-${catSlug})` } : undefined}
					>
						{isLoadingCategories
							? labels.loading
							: catSlug
								? categories.find((cat) => cat.slug === catSlug)?.title
								: labels.selectCategory}
					</button>
					{isDropdownOpen && !isLoadingCategories && (
						<div className="writePage__dropdown-content">
							{categories.map((category) => (
								<div
									key={category.id}
									className="writePage__dropdown-item"
									onClick={() => {
										setCatSlug(category.slug);
										setIsDropdownOpen(false);
									}}
									style={{ color: `var(--category-${category.slug})` }}
								>
									{category.title}
								</div>
							))}
						</div>
					)}
				</div>
				{errors.category && (
					<span className="writePage__error">{labels.errors.categoryRequired}</span>
				)}
			</div>

			<div className="writePage__editor">
				<div className="writePage__addMaterialsButtonContainer">
					<button className="writePage__addMaterialsButton" onClick={() => setOpen(!open)}>
						<Image src="/plus.png" alt="" className="" width={20} height={20} />
					</button>
				</div>
				{open && !media && (
					<div className="writePage__addButtonsContainer">
						<input
							type="file"
							id="image"
							onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
							style={{ display: "none" }}
						/>
						<button className="writePage__addButton">
							<label htmlFor="image" className="labelek">
								<Image src="/image.png" alt="" className="" width={20} height={20} />
							</label>
						</button>
						<button className="writePage__addButton">
							<Image src="/external.png" alt="" className="" width={20} height={20} />
						</button>
						<button className="writePage__addButton">
							<Image src="/video.png" alt="" className="" width={20} height={20} />
						</button>
					</div>
				)}
				{media && (
					<div className="writePage__mediaPreview">
						<Image
							src={media}
							alt="Uploaded media"
							width={300}
							height={200}
							className="writePage__uploadedImage"
						/>
						<button
							className="writePage__removeMedia"
							onClick={() => {
								setMedia("");
								setFile(null);
							}}
						>
							{labels.remove}
						</button>
					</div>
				)}
				<ReactQuill
					theme="bubble"
					value={value}
					onChange={setValue}
					placeholder="Tell story..."
					className={`writePage__textArea ${errors.content ? "writePage__textArea--error" : ""}`}
				/>
				{errors.content && (
					<span className="writePage__error">{labels.errors.contentRequired}</span>
				)}
			</div>
			<div className="writePage__publishContainer">
				<button className="writePage__publish" onClick={handleClick}>
					{labels.publish}
				</button>
			</div>
		</div>
	);
};

export default WritePage;

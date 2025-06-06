import { type MetadataRoute } from "next";
import { PrismaClient } from "@prisma/client";
import { getLocalizedRoutes } from "@/shared/utils/routes";

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const baseUrl = "https://www.bnf-blog.com";
	const locales = ["pl", "en"];
	const now = new Date().toISOString();

	const posts = await prisma.post.findMany({
		where: {
			isVisible: true,
		},
		select: {
			slug: true,
			catSlug: true,
			updatedAt: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	const urls: MetadataRoute.Sitemap = [];

	for (const locale of locales) {
		const localized = getLocalizedRoutes(locale);

		const staticPaths = [
			localized.home,
			localized.login,
			localized.register,
			localized.admin,
			localized.write,
			localized.settings,
			localized.profil,
		];

		for (const path of staticPaths) {
			urls.push({
				url: `${baseUrl}${path}`,
				lastModified: now,
				changeFrequency: "daily",
				priority: 0.7,
			});
		}

		for (const post of posts) {
			const postPath = localized.post(post.slug, post.catSlug);
			urls.push({
				url: `${baseUrl}${postPath}`,
				lastModified: post.updatedAt?.toISOString() ?? now,
				changeFrequency: "weekly",
				priority: 0.9,
			});
		}
	}

	return urls;
}

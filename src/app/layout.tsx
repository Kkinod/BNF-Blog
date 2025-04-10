import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "../../auth";
import { ThemeContextProvider } from "@/shared/context/ThemeContext";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/shared/components/ui/sonner";
import { labels } from "@/shared/utils/labels";
import { i18nConfig } from "@/i18n/settings";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: labels.metadata.blogTitle,
	description: labels.metadata.blogDescription,
};

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params?: { locale?: string };
}>) {
	const session = await auth();

	const locale =
		params?.locale && i18nConfig.locales.includes(params.locale)
			? params.locale
			: i18nConfig.defaultLocale;

	return (
		<html lang={locale}>
			<body className={inter.className}>
				<Toaster richColors />
				<AuthProvider session={session}>
					<ThemeContextProvider>{children}</ThemeContextProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

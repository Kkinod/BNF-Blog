import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "../../auth";
import { Footer } from "@/components/organisms/Footer/Footer";
import { Navbar } from "@/components/organisms/Navbar/Navbar";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { ThemeProvider } from "@/providers/ThemePrvider";
import { AuthProvider } from "@/providers/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { HeroBackground } from "@/components/organisms/HeroBackground/HeroBackground";
import "./globals.css";
import { AuthLinks } from "@/components/organisms/AuthLinks/AuthLinks";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Blog",
	description: "Cyber front blog",
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth();

	return (
		<html lang="en">
			<body className={inter.className}>
				<Toaster richColors />
				<AuthProvider session={session}>
					<ThemeContextProvider>
						<ThemeProvider>
							<div className="container">
								<HeroBackground />
								<div className="wrapper">
									<Navbar>
										<AuthLinks />
									</Navbar>
									<div className="flex flex-1 flex-col">{children}</div>
									<Footer />
								</div>
							</div>
						</ThemeProvider>
					</ThemeContextProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Footer } from "@/components/Footer/Footer";
import { Navbar } from "@/components/Navbar/Navbar";
import { ThemeContextProvider } from "@/context/ThemeContext";
import { ThemeProvider } from "@/providers/ThemePrvider";
import { AuthProvider } from "@/providers/AuthProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Blog",
	description: "Cyber front blog",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<ThemeContextProvider>
						<ThemeProvider>
							<div className="container">
								<div className="wrapper">
									<Navbar />
									{children}
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

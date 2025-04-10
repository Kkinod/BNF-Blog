import { Footer } from "@/shared/components/organisms/Footer/Footer";
import { i18nConfig } from "@/i18n/settings";
import { HeroBackground } from "@/shared/components/organisms/HeroBackground/HeroBackground";
import { Navbar } from "@/shared/components/organisms/Navbar/Navbar";
import { AuthLinks } from "@/shared/components/organisms/AuthLinks/AuthLinks";
import { LanguageSwitcher } from "@/shared/components/molecules/LanguageSwitcher/LanguageSwitcher";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
	return i18nConfig.locales.map((locale) => ({ locale }));
}

export default function LocaleLayout({
	children,
	params,
}: {
	children: React.ReactNode;
	params: { locale: string };
}) {
	const locale = i18nConfig.locales.includes(params.locale)
		? params.locale
		: i18nConfig.defaultLocale;

	return (
		<>
			<div className="container">
				<HeroBackground />
				<div className="wrapper">
					<Navbar>
						<AuthLinks locale={locale} />
						<LanguageSwitcher />
					</Navbar>
					<div className="flex flex-1 flex-col justify-center">{children}</div>
					<Footer locale={locale} />
				</div>
			</div>
		</>
	);
}

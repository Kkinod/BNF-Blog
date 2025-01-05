import { SettingsNavbar } from "./_components/SettingsNavbar";

interface ProtectedLayoutProps {
	children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
	return (
		<div className="flex h-full w-full flex-1 flex-col items-center justify-center gap-y-10">
			<SettingsNavbar />
			{children}
		</div>
	);
};

export default ProtectedLayout;

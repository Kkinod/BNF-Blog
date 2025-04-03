export const InfoItem = ({
	icon,
	label,
	value,
}: {
	icon: React.ReactNode;
	label: string;
	value: React.ReactNode;
}) => {
	return (
		<div className="group flex items-center gap-4 rounded-lg border bg-background/50 p-3 transition-colors hover:bg-background xs:flex-col">
			<div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
				{icon}
			</div>
			<div className="min-w-0 flex-1">
				<p className="text-sm text-muted-foreground s:text-[0.7rem] xs:text-center">{label}</p>
				<div className="break-all font-medium s:text-[0.7rem] xs:text-center">{value}</div>
			</div>
		</div>
	);
};

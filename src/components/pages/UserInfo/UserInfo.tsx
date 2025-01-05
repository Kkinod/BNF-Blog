import { type ExtendedUser } from "../../../../auth";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { labels } from "@/views/labels";

interface UserInfoProps {
	user?: ExtendedUser;
	label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
	return (
		<Card className="w-full max-w-[600px] shadow-md">
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{label}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">{labels.id}</p>
					<p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
						{user?.id}
					</p>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">{labels.name}</p>
					<p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
						{user?.name}
					</p>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">{labels.email}</p>
					<p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
						{user?.email}
					</p>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">{labels.role}</p>
					<p className="max-w-[180px] truncate rounded-md bg-slate-100 p-1 font-mono text-xs">
						{user?.role}
					</p>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
					<p className="text-sm font-medium">{labels.twoFactorAuthentication}</p>
					<Badge variant={user?.isTwoFactorEnabled ? "success" : "destructive"}>
						{user?.isTwoFactorEnabled ? "ON" : "OFF"}
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
};

import { type ExtendedUser } from "../../../../../auth";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { labels } from "@/shared/utils/labels";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/components/ui/avatar";
import { Badge } from "@/shared/components/ui/badge";
import { FaUser, FaEnvelope, FaShieldAlt, FaIdCard, FaLock } from "react-icons/fa";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { InfoItem } from "./components/InfoItem";

interface UserInfoProps {
	user?: ExtendedUser;
	label: string;
}

export const UserInfo = ({ user, label }: UserInfoProps) => {
	// Generate initials for avatar
	const getInitials = () => {
		if (!user?.name) return "U";
		return user.name
			.split(" ")
			.map((part) => part[0])
			.join("")
			.toUpperCase()
			.substring(0, 2);
	};

	return (
		<div className="w-full max-w-[700px] space-y-6">
			<Card className="overflow-hidden">
				<div className="bg-gradient-to-r from-primary/20 to-primary/5 p-6">
					<div className="flex flex-col flex-wrap items-center justify-center gap-4 sm:flex-row">
						<Avatar className="h-20 w-20 border-4 border-background">
							<AvatarImage src={user?.image || ""} alt={user?.name || "User"} />
							<AvatarFallback className="bg-primary/10 text-lg">{getInitials()}</AvatarFallback>
						</Avatar>
						<div className="space-y-1 text-center sm:text-left">
							<h2 className="text-2xl font-bold">{user?.name || "User"}</h2>
							<p className="text-sm text-muted-foreground">{user?.email}</p>
							<div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
								<Badge variant="outline" className="bg-primary/10">
									{user?.role}
								</Badge>
								<Badge
									variant={user?.isTwoFactorEnabled ? "success" : "destructive"}
									className="capitalize"
								>
									{user?.isTwoFactorEnabled ? "2FA Enabled" : "2FA Disabled"}
								</Badge>
							</div>
						</div>
					</div>
				</div>
			</Card>

			<Card>
				<CardHeader>
					<div className="flex items-center gap-2">
						<FaIdCard className="h-5 w-5 text-primary" />
						<h3 className="text-xl font-medium">{labels.userInformation}</h3>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid gap-4">
						<InfoItem
							icon={<FaUser className="h-4 w-4 text-primary" />}
							label={labels.name}
							value={user?.name || "-"}
						/>
						<InfoItem
							icon={<FaEnvelope className="h-4 w-4 text-primary" />}
							label={labels.email}
							value={user?.email || "-"}
						/>
						<InfoItem
							icon={<FaShieldAlt className="h-4 w-4 text-primary" />}
							label={labels.role}
							value={user?.role || "-"}
						/>
						<InfoItem
							icon={<FaIdCard className="h-4 w-4 text-primary" />}
							label={labels.id}
							value={user?.id || "-"}
						/>
						<InfoItem
							icon={<FaLock className="h-4 w-4 text-primary" />}
							label={labels.twoFactorAuthentication}
							value={
								user?.isTwoFactorEnabled ? (
									<div className="flex items-center gap-1 text-green-600 xs:justify-center">
										<CheckCircledIcon className="h-4 w-4" />
										<span>{labels.enabled}</span>
									</div>
								) : (
									<div className="flex items-center gap-1 text-red-600 xs:justify-center">
										<CrossCircledIcon className="h-4 w-4" />
										<span>{labels.disabled}</span>
									</div>
								)
							}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

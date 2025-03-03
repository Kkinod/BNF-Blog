"use client";

import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { admin } from "../../../../../../actions/admin";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { RoleGate } from "@/shared/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

export const AdminCard = () => {
	const onServerActionClick = () => {
		admin()
			.then((data) => {
				if (data.error) {
					toast.error(data.error);
				}
				if (data.success) {
					toast.success(data.success);
				}
			})
			.catch(() => {
				toast.error(labels.errors.somethingWentWrong);
			});
	};

	const onApiRouteClick = () => {
		fetch("/api/admin")
			.then((response) => {
				if (response.ok) {
					toast.success(labels.allowed);
				} else {
					toast.error(labels.errors.forbidden);
				}
			})
			.catch(() => {
				toast.error(labels.errors.somethingWentWrong);
			});
	};

	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{labels.admin}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message={labels.youAreAAdmin} />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">{labels.adminOnlyApiRoute}</p>
					<Button onClick={onApiRouteClick}>{labels.clickToTest}</Button>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">{labels.adminOnlyServerAction}</p>
					<Button onClick={onServerActionClick}>{labels.clickToTest}</Button>
				</div>
			</CardContent>
		</Card>
	);
};

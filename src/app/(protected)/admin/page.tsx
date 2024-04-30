"use client";

import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { admin } from "../../../../actions/admin";
import { FormSuccess } from "@/components/molecules/FormSuccess/FormSuccess";
import { RoleGate } from "@/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { labels } from "@/views/labels";

const AdminPage = () => {
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
		<Card className="w-[600px]">
			<CardHeader>
				<p className="text-center text-2xl font-semibold">Admin</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRole={UserRole.ADMIN}>
					<FormSuccess message="You are a admin" />
				</RoleGate>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin-only API route</p>
					<Button onClick={onApiRouteClick}>Click to test</Button>
				</div>
				<div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-md">
					<p className="text-sm font-medium">Admin-only Server Action</p>
					<Button onClick={onServerActionClick}>Click to test</Button>
				</div>
			</CardContent>
		</Card>
	);
};

export default AdminPage;

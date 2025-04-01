"use client";

import { UserRole } from "@prisma/client";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { RoleGate } from "@/shared/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { labels } from "@/shared/utils/labels";

export const AdminCard = () => {
	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{labels.admin}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRoles={[UserRole.ADMIN, UserRole.SUPERADMIN]}>
					<FormSuccess message={labels.youAreAAdmin} />
				</RoleGate>
			</CardContent>
		</Card>
	);
};

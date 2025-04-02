"use client";

import { useState } from "react";
import { UserRole } from "@prisma/client";
import { RoleGate } from "@/shared/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

export const SuperAdminCard = () => {
	const [isRegistrationEnabled, setIsRegistrationEnabled] = useState(true);

	const toggleRegistration = () => {
		setIsRegistrationEnabled((prev) => !prev);
	};

	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{labels.superAdmin}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRoles={[UserRole.SUPERADMIN]}>
					<div className="mt-4 flex flex-wrap items-center justify-between space-y-2">
						<h2 className="">{labels.registration}</h2>
						<Button
							className="w-[10.5rem]"
							variant={isRegistrationEnabled ? "default" : "destructive"}
							onClick={toggleRegistration}
						>
							{isRegistrationEnabled ? labels.disableRegistration : labels.enableRegistration}
						</Button>
					</div>
				</RoleGate>
			</CardContent>
		</Card>
	);
};

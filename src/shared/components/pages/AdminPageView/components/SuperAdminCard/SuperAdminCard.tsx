"use client";

import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { RoleGate } from "@/shared/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";
import { SimpleLoader } from "@/shared/components/organisms/SimpleLoader";
import { useClientTranslation } from "@/i18n/client-hooks";
import { useRegistration } from "@/hooks/useRegistration";

export const SuperAdminCard = () => {
	const { isRegistrationEnabled, isLoading, toggleRegistration } = useRegistration();
	const { t } = useClientTranslation();

	const handleToggleRegistration = async () => {
		const result = await toggleRegistration();

		if (result.error) {
			toast.error(t("errors.somethingWentWrong", { defaultValue: result.error }));
			return;
		}

		if (isRegistrationEnabled) {
			toast.error(
				t(`admin.${result.success}`) ||
					t("admin.registrationDisabledSuccess", {
						defaultValue: labels.registrationDisabledSuccess,
					}),
			);
		} else {
			toast.success(
				t(`admin.${result.success}`) ||
					t("admin.registrationEnabledSuccess", {
						defaultValue: labels.registrationEnabledSuccess,
					}),
			);
		}
	};

	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">
					{t("admin.superAdmin", { defaultValue: labels.superAdmin })}
				</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<RoleGate allowedRoles={[UserRole.SUPERADMIN]}>
					<div className="mt-4 flex flex-wrap items-center justify-between space-y-2">
						<h2 className="">{t("admin.registration", { defaultValue: labels.registration })}</h2>
						<Button
							className="w-[10.5rem]"
							variant={isRegistrationEnabled ? "success" : "destructive"}
							onClick={handleToggleRegistration}
							disabled={isLoading || isRegistrationEnabled === null}
						>
							{isLoading || isRegistrationEnabled === null ? (
								<SimpleLoader size="small" />
							) : isRegistrationEnabled ? (
								t("admin.disableRegistration", { defaultValue: labels.disableRegistration })
							) : (
								t("admin.enableRegistration", { defaultValue: labels.enableRegistration })
							)}
						</Button>
					</div>
				</RoleGate>
			</CardContent>
		</Card>
	);
};

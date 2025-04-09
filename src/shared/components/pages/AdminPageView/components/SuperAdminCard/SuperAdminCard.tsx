"use client";

import { useState, useEffect } from "react";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { RoleGate } from "@/shared/components/organisms/RoleGate/RoleGate";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";
import { SimpleLoader } from "@/shared/components/organisms/SimpleLoader";
import { useClientTranslation } from "@/i18n/client-hooks";

interface RegistrationResponse {
	isRegistrationEnabled: boolean;
	success?: string;
	error?: string;
}

export const SuperAdminCard = () => {
	const [isRegistrationEnabled, setIsRegistrationEnabled] = useState<boolean | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const { t } = useClientTranslation();

	useEffect(() => {
		const fetchRegistrationState = async () => {
			try {
				const response = await fetch("/api/admin/registration");
				const data = (await response.json()) as RegistrationResponse;
				setIsRegistrationEnabled(data.isRegistrationEnabled);
			} catch (error) {
				console.error("Failed to fetch registration state:", error);
				toast.error(
					t("errors.somethingWentWrong", { defaultValue: labels.errors.somethingWentWrong }),
				);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchRegistrationState();
	}, [t]);

	const toggleRegistration = async () => {
		if (isRegistrationEnabled === null) return;

		try {
			setIsLoading(true);
			const newState = !isRegistrationEnabled;

			const response = await fetch("/api/admin/registration", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isEnabled: newState }),
			});

			const data = (await response.json()) as RegistrationResponse;

			if (data.error) {
				toast.error(t("errors.somethingWentWrong", { defaultValue: data.error }));
				return;
			}

			setIsRegistrationEnabled(newState);

			if (newState) {
				toast.success(
					t(`admin.${data.success}`) ||
						t("admin.registrationEnabledSuccess", {
							defaultValue: labels.registrationEnabledSuccess,
						}),
				);
			} else {
				toast.error(
					t(`admin.${data.success}`) ||
						t("admin.registrationDisabledSuccess", {
							defaultValue: labels.registrationDisabledSuccess,
						}),
				);
			}
		} catch (error) {
			console.error("Failed to toggle registration:", error);
			toast.error(
				t("errors.somethingWentWrong", { defaultValue: labels.errors.somethingWentWrong }),
			);
		} finally {
			setIsLoading(false);
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
							onClick={toggleRegistration}
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

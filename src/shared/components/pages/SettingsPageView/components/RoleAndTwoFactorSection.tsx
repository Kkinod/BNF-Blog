"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { UserRole } from "@prisma/client";

import { type SettingsSchema } from "../../../../../../schemas";
import { labels } from "@/shared/utils/labels";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/shared/components/ui/select";
import { Switch } from "@/shared/components/ui/switch";
import {
	FormField,
	FormControl,
	FormItem,
	FormLabel,
	FormDescription,
	FormMessage,
} from "@/shared/components/atoms/formElements/form";
import { useTranslation } from "@/hooks/useTranslation";

interface RoleAndTwoFactorSectionProps {
	form: UseFormReturn<z.infer<typeof SettingsSchema>>;
	isPending: boolean;
	isOAuth: boolean;
}

export const RoleAndTwoFactorSection = ({
	form,
	isPending,
	isOAuth,
}: RoleAndTwoFactorSectionProps) => {
	const { t } = useTranslation();

	return (
		<>
			<FormField
				control={form.control}
				name="role"
				render={({ field }) => (
					<FormItem>
						<FormLabel>
							{t("roleAndTwoFactorSection.role", {
								defaultValue: labels.roleAndTwoFactorSection.role,
							})}
						</FormLabel>
						<Select
							disabled={isPending}
							onValueChange={field.onChange}
							defaultValue={field.value as UserRole}
						>
							<FormControl>
								<SelectTrigger>
									<SelectValue
										placeholder={t("roleAndTwoFactorSection.selectARole", {
											defaultValue: labels.roleAndTwoFactorSection.selectARole,
										})}
									/>
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value={UserRole.ADMIN}>{labels.admin}</SelectItem>
								<SelectItem value={UserRole.USER}>{labels.user}</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			{!isOAuth && (
				<FormField
					control={form.control}
					name="isTwoFactorEnabled"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
							<div className="space-y-0.5">
								<FormLabel>
									{t("roleAndTwoFactorSection.twoFactorAuthentication", {
										defaultValue: labels.roleAndTwoFactorSection.twoFactorAuthentication,
									})}
								</FormLabel>
								<FormDescription>
									{t("roleAndTwoFactorSection.enableTwoFactorAuthentication", {
										defaultValue: labels.roleAndTwoFactorSection.enableTwoFactorAuthentication,
									})}
								</FormDescription>
							</div>
							<FormControl>
								<Switch
									disabled={isPending}
									checked={Boolean(field.value)}
									onCheckedChange={field.onChange}
									className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500"
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			)}
		</>
	);
};

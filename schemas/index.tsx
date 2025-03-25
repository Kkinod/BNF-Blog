import { z } from "zod";
import { UserRole } from "@prisma/client";
import { labels } from "@/shared/utils/labels";

export const NewPasswordSchema = z.object({
	password: z.string().min(6, labels.errors.min6CharactersRequired),
});

export const ResetSchema = z.object({
	email: z.string().email(labels.errors.emailIsRequired),
});

export const LoginSchema = z.object({
	email: z.string().email(labels.errors.emailIsRequired),
	password: z.string().min(1, labels.errors.passwordIsRequired),
	code: z.string().optional(),
});

export const RegisterSchema = z
	.object({
		email: z.string().email(labels.errors.emailIsRequired),
		password: z.string().min(8, labels.errors.min8CharactersRequired),
		confirmPassword: z.string().min(1, labels.errors.confirmPassword),
		name: z.string().min(1, labels.errors.nameIsRequired),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: labels.errors.passwordsDoNotMatch,
		path: ["confirmPassword"],
	});

export const SettingsSchema = z
	.object({
		name: z.string().optional(),
		isTwoFactorEnabled: z.boolean().optional(),
		role: z.enum([UserRole.ADMIN, UserRole.USER]),
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
		newPassword: z.string().min(6).optional(),
	})
	.refine(
		(data) => {
			if (data.password && !data.newPassword) {
				return false;
			}

			if (!data.password && data.newPassword) {
				return false;
			}

			return true;
		},
		{
			message: labels.errors.passwordAndNewPasswordIsRequired,
			path: ["newPassword"],
		},
	);

import { z } from "zod";
import { UserRole } from "@prisma/client";
import { labels } from "@/shared/utils/labels";

export const PASSWORD_MIN_LENGTH = 8;

const createPasswordField = () =>
	z.string().min(PASSWORD_MIN_LENGTH, labels.errors.min8CharactersRequired);

const createConfirmPasswordField = () => z.string().min(1, labels.errors.confirmPassword);

const createEmailField = () => z.string().email(labels.errors.emailIsRequired);

const createNameField = () => z.string().min(1, labels.errors.nameIsRequired);

export const NewPasswordSchema = z
	.object({
		password: createPasswordField(),
		confirmPassword: createConfirmPasswordField(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: labels.errors.passwordsDoNotMatch,
		path: ["confirmPassword"],
	});

export const ResetSchema = z.object({
	email: createEmailField(),
});

export const LoginSchema = z.object({
	email: createEmailField(),
	password: z.string().min(1, labels.errors.passwordIsRequired),
	code: z.string().optional(),
});

export const RegisterSchema = z
	.object({
		email: createEmailField(),
		password: createPasswordField(),
		confirmPassword: createConfirmPasswordField(),
		name: createNameField(),
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
		email: createEmailField().optional(),
		password: z.string().min(1, labels.errors.passwordIsRequired).optional(),
		newPassword: createPasswordField().optional(),
		confirmNewPassword: createConfirmPasswordField().optional(),
	})
	.refine(
		(data) => {
			if (data.newPassword && !data.confirmNewPassword) {
				return false;
			}

			return true;
		},
		{
			message: labels.errors.confirmPassword,
			path: ["confirmNewPassword"],
		},
	)
	.refine(
		(data) => {
			if (
				data.newPassword &&
				data.confirmNewPassword &&
				data.newPassword !== data.confirmNewPassword
			) {
				return false;
			}

			return true;
		},
		{
			message: labels.errors.passwordsDoNotMatch,
			path: ["confirmNewPassword"],
		},
	);

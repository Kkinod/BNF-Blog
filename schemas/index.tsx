import { z } from "zod";
import { labels } from "@/views/labels";

export const ResetSchema = z.object({
	email: z.string().email(labels.errors.emailIsRequired),
});

export const LoginSchema = z.object({
	email: z.string().email(labels.errors.emailIsRequired),
	password: z.string().min(1, labels.errors.passwordIsRequired),
});

export const RegisterSchema = z.object({
	email: z.string().email(labels.errors.emailIsRequired),
	password: z.string().min(6, labels.errors.passwordIsRequired),
	name: z.string().min(1, labels.errors.nameIsRequired),
});

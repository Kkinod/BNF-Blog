import { z } from "zod";
import { labels } from "@/views/labels";

export const LoginSchema = z.object({
	email: z.string().email(labels.emailIsRequired),
	password: z.string().min(1, labels.passwordIsRequired),
});

export const RegisterSchema = z.object({
	email: z.string().email(labels.emailIsRequired),
	password: z.string().min(6, labels.passwordIsRequired),
	name: z.string().min(1, labels.nameIsRequired),
});

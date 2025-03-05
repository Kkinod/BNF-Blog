import { Resend } from "resend";
import { labels } from "@/shared/utils/labels";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `${process.env.NEXTAUTH_URL}/new-password?token=${token}`;

	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.resetYourPassword,
		html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `${process.env.NEXTAUTH_URL}/new-verification?token=${token}`;

	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.pleaseConfirmYourEmail,
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: "no-reply@bnf-blog.com",
		to: email,
		subject: labels.twoFACode,
		html: `<p>Your 2FA code: ${token}</p>`,
	});
};

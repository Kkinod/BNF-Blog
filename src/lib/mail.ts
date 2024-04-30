import { Resend } from "resend";
import { labels } from "@/views/labels";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email: string, token: string) => {
	const resetLink = `http://localhost:3000/new-password?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: labels.resetYourPassword,
		html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
	});
};

export const sendVerificationEmail = async (email: string, token: string) => {
	const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: labels.pleaseConfirmYourEmail,
		html: `<p>Click <a href="${confirmLink}">here</a> to confirm email</p>`,
	});
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
	await resend.emails.send({
		from: "onboarding@resend.dev",
		to: email,
		subject: labels.twoFACode,
		html: `<p>Your 2FA code: ${token}</p>`,
	});
};

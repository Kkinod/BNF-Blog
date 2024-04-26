"use server";

import { signOut } from "../auth";

export const logout = async () => {
	// some server stuff for eg. removing some information about user before logout - or something like that
	await signOut();
};

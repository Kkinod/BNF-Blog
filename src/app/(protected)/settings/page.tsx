"use client";

import { logout } from "../../../../actions/logout";
import { labels } from "@/views/labels";

const SettingPage = () => {

	const onClick = () => {
		logout()
			.then(() => {
				// Dodatkowe akcje po pomyślnym wylogowaniu, np. przekierowanie
			})
			.catch((error) => {
				console.error("Error logging out:", error);
			});
	};

	return (
		<div className="rounded-xl bg-white p-10">
			<form>
				<button onClick={onClick} type="submit">
					{labels.logout}
				</button>
			</form>
		</div>
	);
};

export default SettingPage;

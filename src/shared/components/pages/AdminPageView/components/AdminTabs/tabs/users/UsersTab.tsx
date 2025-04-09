import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { labels } from "@/shared/utils/labels";
import { useClientTranslation } from "@/i18n/client-hooks";

export const UsersTab = () => {
	const { t } = useClientTranslation();

	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">
					{t("admin.users.list", { defaultValue: labels.users.list })}
				</p>
			</CardHeader>
			<CardContent>
				<p className="text-center text-muted-foreground">
					{t("admin.users.sectionInPreparation", {
						defaultValue: labels.common.sectionInPreparation,
					})}
				</p>
			</CardContent>
		</Card>
	);
};

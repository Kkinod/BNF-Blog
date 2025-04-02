import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import { labels } from "@/shared/utils/labels";

export const UsersTab = () => {
	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">{labels.users.list}</p>
			</CardHeader>
			<CardContent>
				<p className="text-center text-muted-foreground">{labels.common.sectionInPreparation}</p>
			</CardContent>
		</Card>
	);
};

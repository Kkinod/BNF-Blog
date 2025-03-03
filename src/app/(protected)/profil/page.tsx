import { UserInfo } from "@/shared/components/pages/UserInfo/UserInfo";
import { currentUser } from "@/features/auth/utils/currentUser";
import { labels } from "@/shared/utils/labels";

const ServerPage = async () => {
	const user = await currentUser();

	return <UserInfo user={user} label={labels.userInformation} />;
};

export default ServerPage;

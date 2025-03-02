import { UserInfo } from "@/components/pages/UserInfo/UserInfo";
import { currentUser } from "@/lib/currentUser";
import { labels } from "@/views/labels";

const ServerPage = async () => {
	const user = await currentUser();

	return <UserInfo user={user} label={labels.userInformation} />;
};

export default ServerPage;

import Header from "../components/common/Header";
import ConnectedAccounts from "../components/settings/ConnectedAccounts";
import DangerZone from "../components/settings/DangerZone";
import Notifications from "../components/settings/Notifications";
import Profile from "../components/settings/Profile";
import Security from "../components/settings/Security";
import ThemeSettings from "../components/settings/ThemeSettings";

const SettingsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 dark:bg-gray-900 bg-light-primary'>
			<Header title='Settings' />
			<main className='max-w-4xl mx-auto py-6 px-4 lg:px-8'>
				<ThemeSettings />
				<Security />
				<DangerZone />
			</main>
		</div>
	);
};
export default SettingsPage;

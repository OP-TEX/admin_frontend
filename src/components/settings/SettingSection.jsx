import { motion } from "framer-motion";

const SettingSection = ({ icon: Icon, title, children }) => {
	return (
		<motion.div
			className='dark:bg-gray-800 bg-gray-100 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-300 mb-8'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<div className='flex items-center mb-4'>
				<Icon className='dark:text-indigo-400 text-indigo-600 mr-4' size='24' />
				<h2 className='text-xl font-semibold dark:text-gray-100 text-gray-900'>{title}</h2>
			</div>
			{children}
		</motion.div>
	);
};
export default SettingSection;

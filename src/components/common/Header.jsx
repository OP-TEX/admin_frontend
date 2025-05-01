const Header = ({ title }) => {
	return (
		<header className='dark:bg-gray-800 bg-gray-100 bg-opacity-50 backdrop-blur-md shadow-lg border-b dark:border-gray-700 border-gray-300'>
			<div className='max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8'>
				<h1 className='text-2xl font-semibold dark:text-gray-100 text-gray-900'>{title}</h1>
			</div>
		</header>
	);
};
export default Header;

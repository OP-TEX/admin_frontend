import { BarChart2, DollarSign, Menu, Settings, ShoppingBag, ShoppingCart, TrendingUp, Users, LogOut } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const SIDEBAR_ITEMS = [
    // {
    //     name: "Overview",
    //     icon: BarChart2,
    //     color: "#6366f1",
    //     href: "/",
    // },
    { name: "Products", icon: ShoppingBag, color: "#8B5CF6", href: "/" },
    { name: "Users", icon: Users, color: "#EC4899", href: "/users" },
    // { name: "Sales", icon: DollarSign, color: "#10B981", href: "/sales" },
    // { name: "Orders", icon: ShoppingCart, color: "#F59E0B", href: "/orders" },
    // { name: "Analytics", icon: TrendingUp, color: "#3B82F6", href: "/analytics" },
    { name: "Settings", icon: Settings, color: "#6EE7B7", href: "/settings" },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        // Dispatch logout action to clear all auth data
        dispatch(logout());
        
        // Force reload the page to clear any cached data
        window.location.href = '/login';
        // Alternative to navigate:
        // navigate('/login', { replace: true });
    };

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen ? "w-64" : "w-20"
            }`}
            animate={{ width: isSidebarOpen ? 256 : 80 }}
        >
            <div className='h-full dark:bg-gray-800 bg-white bg-opacity-50 dark:bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r dark:border-gray-700 border-gray-200'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='p-2 rounded-full dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors max-w-fit
                        dark:text-gray-200 text-gray-700'
                >
                    <Menu size={24} />
                </motion.button>

                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div 
                                className='flex items-center p-4 text-sm font-medium rounded-lg 
                                    dark:hover:bg-gray-700/50 hover:bg-gray-100 
                                    dark:text-gray-200 text-gray-700
                                    transition-all duration-200 mb-2
                                    hover:shadow-md dark:hover:shadow-gray-800/50'
                            >
                                <item.icon 
                                    size={20} 
                                    style={{ color: item.color, minWidth: "20px" }} 
                                    className="transition-transform duration-200 group-hover:scale-110"
                                />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{ opacity: 1, width: "auto" }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{ duration: 0.2, delay: 0.3 }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}

                    {/* Logout Button */}
                    <motion.button
                        onClick={handleLogout}
                        className='flex items-center w-full p-4 text-sm font-medium rounded-lg 
                            dark:hover:bg-red-900/30 hover:bg-red-100 
                            dark:text-red-400 text-red-600
                            transition-all duration-200 mb-2'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogOut 
                            size={20} 
                            className="min-w-[20px] transition-transform duration-200" 
                        />
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.span
                                    className='ml-4 whitespace-nowrap'
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    transition={{ duration: 0.2, delay: 0.3 }}
                                >
                                    Logout
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const ThemeSettings = () => {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Theme Settings</h2>
            <div className="flex items-center justify-between py-3">
                <div className="flex items-center">
                    <span className="dark:text-gray-300 text-gray-600 mr-2">Light</span>
                    <Sun size={16} className="dark:text-gray-300 text-gray-600" />
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none">
                    <input
                        type="checkbox"
                        checked={theme === 'dark'}
                        onChange={toggleTheme}
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                    />
                    <label
                        className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                </div>
                <div className="flex items-center">
                    <Moon size={16} className="dark:text-gray-300 text-gray-600 mr-2" />
                    <span className="dark:text-gray-300 text-gray-600">Dark</span>
                </div>
            </div>
            <p className="dark:text-gray-400 text-gray-500 text-sm mt-2">
                Choose between dark and light mode for your dashboard experience.
            </p>
        </div>
    );
};

export default ThemeSettings;
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const dailyOrdersData = [
    { date: "07/01", orders: 45 },
    { date: "07/02", orders: 52 },
    { date: "07/03", orders: 49 },
    { date: "07/04", orders: 60 },
    { date: "07/05", orders: 55 },
    { date: "07/06", orders: 58 },
    { date: "07/07", orders: 62 },
];

const DailyOrders = () => {
    const { theme } = useTheme();

    return (
        <motion.div
            className='dark:bg-gray-800 bg-white bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-200'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <h2 className='text-xl font-semibold dark:text-gray-100 text-gray-800 mb-4'>Daily Orders</h2>

            <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                    <LineChart data={dailyOrdersData}>
                        <CartesianGrid strokeDasharray='3 3' stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                        <XAxis dataKey='date' stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                        <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme === 'dark' ? "rgba(31, 41, 55, 0.8)" : "rgba(255, 255, 255, 0.8)",
                                borderColor: theme === 'dark' ? "#4B5563" : "#E5E7EB", 
                            }}
                            itemStyle={{ color: theme === 'dark' ? "#E5E7EB" : "#1F2937" }}
                        />
                        <Legend 
                            wrapperStyle={{
                                color: theme === 'dark' ? "#E5E7EB" : "#1F2937"
                            }}
                        />
                        <Line 
                            type='monotone' 
                            dataKey='orders' 
                            stroke='#8B5CF6' 
                            strokeWidth={2} 
                            dot={{ 
                                fill: theme === 'dark' ? '#8B5CF6' : '#6366F1',
                                strokeWidth: 2, 
                                r: 4 
                            }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
export default DailyOrders;
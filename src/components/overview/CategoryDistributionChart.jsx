import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const categoryData = [
    { name: "Electronics", value: 4500 },
    { name: "Clothing", value: 3200 },
    { name: "Home & Garden", value: 2800 },
    { name: "Books", value: 2100 },
    { name: "Sports & Outdoors", value: 1900 },
];

const COLORS = ["#6366F1", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const CategoryDistributionChart = () => {
    const renderCustomizedLabel = ({ name, percent }) => {
        return `${name} ${(percent * 100).toFixed(0)}%`;
    };

    return (
        <motion.div
            className='dark:bg-gray-800 bg-white bg-opacity-50 dark:bg-opacity-50 
                backdrop-blur-md shadow-lg rounded-xl p-6 
                border dark:border-gray-700 border-gray-200'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <h2 className='text-lg font-medium mb-4 dark:text-gray-100 text-gray-900'>
                Category Distribution
            </h2>
            <div className='h-80'>
                <ResponsiveContainer width={"100%"} height={"100%"}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            cx={"50%"}
                            cy={"50%"}
                            labelLine={false}
                            outerRadius={80}
                            fill='#8884d8'
                            dataKey='value'
                            label={renderCustomizedLabel}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "var(--tooltip-bg)",
                                borderColor: "var(--tooltip-border)",
                                color: "var(--tooltip-text)",
                            }}
                            itemStyle={{ 
                                color: "currentColor" 
                            }}
                            wrapperStyle={{
                                outline: 'none'
                            }}
                        />
                        <Legend
                            wrapperStyle={{
                                color: "var(--text-primary)"
                            }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* CSS variables for theme-based colors */}
            <style jsx>{`
                :root {
                    --tooltip-bg: #ffffff;
                    --tooltip-border: #e5e7eb;
                    --tooltip-text: #111827;
                    --text-primary: #111827;
                }

                @media (prefers-color-scheme: dark) {
                    :root {
                        --tooltip-bg: rgba(31, 41, 55, 0.8);
                        --tooltip-border: #4B5563;
                        --tooltip-text: #E5E7EB;
                        --text-primary: #E5E7EB;
                    }
                }
            `}</style>
        </motion.div>
    );
};

export default CategoryDistributionChart;
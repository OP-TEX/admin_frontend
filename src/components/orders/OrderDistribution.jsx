import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";
import { orderApi } from "../../services/api";
import toast from 'react-hot-toast';

const COLORS = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#FED766", "#2AB7CA"];

const OrderDistribution = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [orderStatusData, setOrderStatusData] = useState([]);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderStats();
      const stats = response.data.stats;

      // Transform the status counts into data for the pie chart
      const statusData = Object.entries(stats.statusCounts).map(([name, value]) => ({
        name,
        value
      }));

      setOrderStatusData(statusData);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      toast.error('Failed to load order distribution');
      // Fallback data
      setOrderStatusData([
        { name: "Pending", value: 0 },
        { name: "Confirmed", value: 0 },
        { name: "Out for Delivery", value: 0 },
        { name: "Delivered", value: 0 },
        { name: "Cancelled", value: 0 },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className='dark:bg-gray-800 bg-white bg-opacity-100 dark:bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border dark:border-gray-700 border-gray-200'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className='text-xl font-semibold dark:text-gray-100 text-gray-800'>Order Status Distribution</h2>
        {loading && (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
        )}
      </div>

      {orderStatusData.length > 0 ? (
        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={orderStatusData}
                cx='50%'
                cy='50%'
                outerRadius={80}
                fill='#8884d8'
                dataKey='value'
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {orderStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px] text-gray-500 dark:text-gray-400">
          No order data available
        </div>
      )}
    </motion.div>
  );
};

export default OrderDistribution;
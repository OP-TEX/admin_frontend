import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, DollarSign, Clock, Check } from "lucide-react";
import { orderApi } from "../../services/api";
import toast from 'react-hot-toast';
import StatCard from "../common/StatCard";

const OrderStats = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSales: 0,
    pendingSales: 0,
    completedSales: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderStats();
  }, []);

  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      const response = await orderApi.getOrderStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching order stats:', error);
      toast.error('Failed to load order statistics');
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `$${amount.toFixed(2)}`;
  };

  return (
    <motion.div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
        <StatCard
            name="Total Orders"
            icon={ShoppingBag}
            value={loading ? "..." : stats.totalOrders}
            color="#6366F1"
        />
        {/* <StatCard
        name="Total Sales"
        icon={DollarSign}
        value={loading ? "..." : formatCurrency(stats.totalSales)}
        color="#10B981"
      />
      <StatCard
        name="Pending Revenue"
        icon={Clock}
        value={loading ? "..." : formatCurrency(stats.pendingSales)}
        color="#F59E0B"
      /> */}
      {/* <StatCard
        name="Completed Sales"
        icon={Check}
        value={loading ? "..." : formatCurrency(stats.completedSales)}
        color="#EF4444"
      /> */}
    </motion.div>
  );
};

export default OrderStats;
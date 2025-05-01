import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

const DangerZone = () => {
  return (
    <motion.div
      className='dark:bg-red-900 bg-red-100 bg-opacity-50 dark:bg-opacity-50 
        backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 
        border dark:border-red-700 border-red-200 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className='flex items-center mb-4'>
        <Trash2 
          className='dark:text-red-400 text-red-600 mr-3' 
          size={24} 
        />
        <h2 className='text-xl font-semibold dark:text-gray-100 text-gray-900'>
          Danger Zone
        </h2>
      </div>
      <p className='dark:text-gray-300 text-gray-600 mb-4'>
        Permanently delete your account and all of your content.
      </p>
      <button
        className='bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded
          transition duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 
          focus:ring-opacity-50'
      >
        Delete Account
      </button>
    </motion.div>
  );
};

export default DangerZone;
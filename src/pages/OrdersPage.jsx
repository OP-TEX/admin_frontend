import { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import OrdersTable from '../components/orders/OrdersTable';
import OrderDistribution from '../components/orders/OrderDistribution';
import OrderStats from '../components/orders/OrderStats';

const OrdersPage = () => {
  return (
    <div className='flex-1 overflow-auto relative z-10'>
      <Header title='Orders' />

      <main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
        {/* Order Statistics */}
        <OrderStats />

        {/* Orders Table */}
        <OrdersTable />
        
        {/* Charts */}
        <div className='mt-6 grid grid-cols-1 lg:grid-cols-1 gap-6'>
          <OrderDistribution />
        </div>
      </main>
    </div>
  );
};

export default OrdersPage;
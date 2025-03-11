// pages/orders.tsx
'use client'
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Order = {
    _id: number,
  createdAt: string;
  status: 'ON HOLD' | 'FAILED' | 'COMPLETED';
  total: string;
  items: number;
};


const MyOrders: React.FC = () => {

    const { userId } = useParams<{ userId: string }>();
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if(!userId) return;
        const fetchOrders = async (id: string) => {
          try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/order/getOrdersByUserId/` + userId.toString());
            console.log(id);
            setOrders(response.data.orders); 
          } catch (err: any) {
            setError(err.response?.data?.message || 'Something went wrong');
          } finally {
            setLoading(false);
          }
        };
    
        fetchOrders(userId);
      }, [userId]);

      const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
      };
  return (
    <div className="container h-full mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4">Date</th>
            <th className="py-2 px-4">Status</th>
            <th className="py-2 px-4">Total</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
              <td className="py-2 px-4">
                <span className="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full text-sm">
                  {order.status}
                </span>
              </td>

              <td className="py-2 px-4">{order.total} for {order.items} item{order.items > 1 && 's'}</td>
              
              <td className="py-2 px-4">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-4 rounded">
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-end">
        <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded">
          Next
        </button>
      </div>
    </div>
  );
};

export default MyOrders;

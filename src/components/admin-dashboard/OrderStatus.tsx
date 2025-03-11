// pages/orders.tsx
'use client'
import Footer from '@/components/UserFlow/Footer';
import axios from 'axios';
import { useParams, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/UserFlow/NavBar'
import Link from 'next/link';

type Order = {
  _id: number,
  createdAt: string;
  status: 'ON HOLD' | 'FAILED' | 'COMPLETED';
  coursePrice: string;
  items: number;
};

const OrderStatus: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/order/getAllOrders/`);
        const fetchedOrders = response.data.orders.map((order: any) => ({
          ...order,
          coursePrice: order.price, 
        }));
        setOrders(fetchedOrders); // Assuming the API returns orders in `response.data.orders`
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
  };

  const handleStatusChange = async (orderId: number, newStatus: Order['status']) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/order/updateOrderStatus`, {
        orderId,
        status: newStatus,
      });
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  return (
    <div className="container h-[31rem] mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">All Orders</h1>
      <div className="overflow-y-auto max-h-[20rem]">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-100">
            <tr className="bg-gray-100 text-left">
              <th className='py-2 px-4'>Order Id</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Total</th>
              <th className="py-2 px-4">Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className='py-2 px-4'>{order._id}</td>
                <td className="py-2 px-4">{formatDate(order.createdAt)}</td>
                <td className="py-2 px-4">
                  <span className={`${order.status === "ON HOLD" ? `text-yellow-600 bg-yellow-100` : `${order.status === "FAILED" ? `bg-red-500 text-white` : `bg-green-500 text-white`} `} py-1 px-3 rounded-full text-sm`}>
                    {order.status}
                  </span>
                </td>
                <td className="py-2 px-4">${order.coursePrice}</td>
                <td className="py-2 px-4">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value as Order['status'])}
                    className="border border-gray-300 p-1 rounded"
                  >
                    <option value="ON HOLD" className='text-yellow-200'>ON HOLD</option>
                    <option value="FAILED">FAILED</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderStatus;

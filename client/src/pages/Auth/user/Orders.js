import React, { useState, useEffect } from 'react';
import Layout from '../../../components/Layout/Layout';
import UserMenu from '../../../components/Layout/UserMenu';
import axios from 'axios';
import { useAuth } from '../../../context/auth';

const Orders = () => {
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getOrders = async () => {
        try {
            const { data } = await axios.get('/api/v1/auth/orders');
            setOrders(data);
        } catch (error) {
            setError(error.message || 'An error occurred while fetching orders.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            getOrders();
        }
    }, [auth?.token]);

    return (
        <Layout title={'Your Orders'}>
            <div className='container-fluid p-3 m-3'>
                <div className='row'>
                    <div className='col-md-3'>
                        <UserMenu />
                    </div>
                    <div className='col-md-9'>
                        <h1>Your Orders</h1>
                        {loading && <p>Loading...</p>}
                        {error && <p>Error: {error}</p>}
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <div key={order.orderId} className='mb-4'>
                                    <h4>Order #{order.orderId}</h4>
                                    <p>Date: {new Date(order.date).toLocaleDateString()}</p>
                                    {/* Add other order details as needed */}
                                </div>
                            ))
                        ) : (
                            <p>No orders found.</p>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Orders

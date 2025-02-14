import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { backendURL, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const Orders = ({ token }) => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    if (!token) {
      return null;
    }
    try {
      const response = await axios.post(backendURL + '/api/order/list', {}, { headers: { token } });
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      }
      else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }

  const statusHandler = async (event, orderId) =>{
    try {
      const response = await axios.post(backendURL+'/api/order/status', {orderId, status:event.target.value}, {headers:{token}});
      if(response.data.success){
        await fetchOrders();
      }
    } catch (error) {
      console.log(error.message);
      toast.error(response.data.message);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img className='w-12' src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {
                    order.items.map((item, index) => {
                      return <p className='py-0.5' key={index}>Item:{item.name}, Quantity:{item.quantity}, <span>Variant:{item.variant}</span></p>
                    })
                  }
                </div>
                <p className='mt-3 mb-2 font-medium'>Name: {order.address.name}</p>
                <div>Address:
                  <p className='text-sm sm:text-[15px]'>{order.address.address}, {order.address.pin}, {order.address.city}, {order.address.state} </p>
                </div>
                <p>Phone: {order.address.phone} </p>
              </div>
              <div>
                <p className='mt-3 mb-2 font-medium'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>Amount: {currency} {order.amount} </p>
              <select onChange={(event)=>statusHandler(event,order._id)} value={order.status} className='p-2 font-semibold'>
                <option value="Order Placed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders

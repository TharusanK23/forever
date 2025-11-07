import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { baseApiUrl, currencySymbol } from '../App';
import { useEffect } from 'react';
import { assets } from '../assets/assets';

const Orders = ({token}) => {

  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    if(!token) {
      return null;
    }
    try {
      const res = await axios.post(baseApiUrl + "/api/order/admin/orders", {}, {headers: {Authorization : token}});
      if(res.data.success) {
        let allOrder = [];
        res.data.result.map(order => {
          order.items.map(item => {
            item['status'] = order.status;
            item['paymentMethod'] = order.paymentMethod;
            item['payment'] = order.payment;
            item['date'] = order.date;
            allOrder.push(item);
          })
        })
        setOrders(res.data.result);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if(error.status == 400) {
          toast.error(error.response.data.message);
      } else {
          toast.error(error.message);
      }
    }
  }

  const updateStatus = async (e, orderId) => {
    try {
      const res = await axios.post(baseApiUrl + "/api/order/admin/status", {orderId, status: e.target.value}, {headers: {Authorization : token}});
      if(res.data.success) {
        toast.success(res.data.message);
        await loadOrders();
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if(error.status == 400) {
          toast.error(error.response.data.message);
      } else {
          toast.error(error.message);
      }
    }
  }

  useEffect(() => {
    loadOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div>
        {
          orders.map((order, index) => (
            <div className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700' key={index}>
              <img src={assets.parcel_icon} alt="" className='w-12' />
              <div>
                <div>
                  {
                    order.items.map((item, idx) => {
                      if(idx === order.items.length - 1) {
                        return <p className='py-0.5' key={idx}>{item.name} x <span className='font-semibold'>{item.quantity}</span> - <span> {item.size}</span></p>
                      } else {
                        return <p className='py-0.5' key={idx}>{item.name} x <span className='font-semibold'>{item.quantity}</span> - <span> {item.size}</span> , </p>
                      }
                    })
                  }
                </div>
                <p className='mt-3 mb-2 font-medium'>{order.address.firstName + " " + order.address.lastName}</p>
                <div>
                  <p>{order.address.street + ","}</p>
                  <p>{order.address.city + ", " + order.address.state + ", " + order.address.country + ","}</p>
                  <p>{order.address.zipcode}</p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className='text-sm sm:text-[15px]'>Items : {order.items.length}</p>
                <p className='mt-3'>Method : {order.paymentMethod}</p>
                <p>Payment : {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date : {new Date(order.date).toDateString()}</p>
              </div>
              <p className='text-sm sm:text-[15px]'>{currencySymbol}{order.amount}</p>
              <select onChange={(e) => updateStatus(e, order._id)} className='p-2 font-semibold' value={order.status}>
                <option value="Order Placed">Order Placed</option>
                <option value="Confirmed">Order Placed</option>
                <option value="Packing">Packing</option>
                <option value="Shipped">Shipped</option>
                <option value="Out for delivery">Out for delivery</option>
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
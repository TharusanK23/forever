import { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title';
import { toast } from 'react-toastify';
import axios from 'axios';

const Orders = () => {

  const {baseApiUrl, token, currency} = useContext(ShopContext);
  const [orders, setOrders] = useState([]);

  const loadOrders = async () => {
    try {
      if(!token) {
        return null;
      }
      const res = await axios.post(baseApiUrl + "/api/order/userorders", {}, {headers: {Authorization : token}});
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
        setOrders(allOrder.reverse());
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
    <div className='border-gray-200 border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'} />
      </div>

      <div>
        {
          orders.map((order, index) => (
            <div key={index} className='py-4 border-t border-b border-gray-200 text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img src={order.image[0]} alt="" className='w-16 sm:w-20' />
                <div>
                  <p className='sm:text-base font-medium'>{order.name}</p>
                  <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                    <p className='text-lg'>{currency}{order.price}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>Size: {order.size}</p>
                  </div>
                  <p className='mt-1'>Date: <span className='text-gray-400'>{new Date(order.date).toDateString()}</span></p>
                  <p className='mt-1'>Payment: <span className='text-gray-400'>{order.paymentMethod}</span></p>
                </div>
              </div>
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className='min-w-2 h-2 rounded-full bg-green-500'></p>
                  <p className='text-sm md:text-base'>{order.status}</p>
                </div>
                <button onClick={loadOrders} className='border border-gray-200 px-4 py-2 text-sm font-medium rounded-sm cursor-pointer'>Track Order</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Orders
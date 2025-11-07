import { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from "../assets/assets"
import CartTotal from "../components/CartTotal"
import Title from "../components/Title"
import { toast } from 'react-toastify'
import axios from 'axios'

const PlaceOrder = () => {

  const {navigate, baseApiUrl, token, cartItems, setCartItems, getCartAmout, delivery_fee, products} = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    phone: ''
  });

  const onChangeHandler = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData(data => ({...data, [name]: value}));
  }

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      
      let orderItems = [];
      for(const items in cartItems) {
        for(const item in cartItems[items]) {
          if(cartItems[items][item] > 0) {
            const itemInfo = structuredClone(products.find(prod => prod._id === items));
            if(itemInfo) {
              itemInfo.quantity = cartItems[items][item];
              itemInfo.size = item;
              orderItems.push(itemInfo);
            }
          }
        }
      }

      let orderData = {
        items: orderItems,
        amount: getCartAmout() + delivery_fee,
        address: formData,
        paymentMethod: method
      };

      switch(method) {
        // API call for Cash on Delivery
        case 'cod': {
          const resCOD = await axios.post(baseApiUrl + "/api/order/place", orderData, {headers: {Authorization : token}});
          if(resCOD.data.success) {
            setCartItems({});
            toast.success(resCOD.data.message);
            navigate('/orders');
          } else {
            toast.error(resCOD.data.message);
          }
          break;
        }
        // API call for Razorpay payment
        case 'stripe': {
          const resStripe = await axios.post(baseApiUrl + "/api/order/stripe", orderData, {headers: {Authorization : token}});
          if(resStripe.data.success) {
            const stripeUrl = resStripe.data.result.url;
            window.location.replace(stripeUrl);
          } else {
            toast.error(resStripe.data.message);
          }
          break;
        }
        // API call for Stripe payment
        default: { 
          toast.info("Payment method not available currently");
          // const resRazorpay = await axios.post(baseApiUrl + "/api/order/razorpay", orderData, {headers: {Authorization : token}});
          // if(resRazorpay.data.success) {
          //   setCartItems({});
          //   toast.success(resRazorpay.data.message);
          //   navigate('/orders');
          // } else {
          //   toast.error(resRazorpay.data.message);
          // }
          break;
        }
      }
    } catch (error) {
      console.log(error);
      
      if(error.status == 400) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t border-gray-200">
      {/* ----------- Left Side ----------- */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} value={formData.firstName} name='firstName' type="text" placeholder="First name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
          <input onChange={onChangeHandler} value={formData.lastName} name='lastName' type="text" placeholder="Last name" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
        </div>
        <input onChange={onChangeHandler} value={formData.email} name='email' type="email" placeholder="Email address" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
        <input onChange={onChangeHandler} value={formData.street} name='street' type="text" placeholder="Street" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
        <div className="flex gap-3">
          <input onChange={onChangeHandler} value={formData.city} name='city' type="text" placeholder="City" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
          <input onChange={onChangeHandler} value={formData.state} name='state' type="text" placeholder="State" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
        </div>
        <div className="flex gap-3">
          <input onChange={onChangeHandler} value={formData.zipcode} name='zipcode' type="number" placeholder="Zipcode" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
          <input onChange={onChangeHandler} value={formData.country} name='country' type="text" placeholder="Country" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
        </div>
        <input onChange={onChangeHandler} value={formData.phone} name='phone' type="number" placeholder="Phone number" className="border border-gray-300 rounded py-1.5 px-3.5 w-full" required />
      </div>

      {/* ---------- Right Side --------------- */}
      <div className="mt-8">
        <div className="mt-8 min-w-80">
          <CartTotal />
        </div>

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />
          {/* ---------- Payment Method Selection ------------ */}
          <div className="flex gap-3 flex-col lg:flex-row">
            <div onClick={() => setMethod('stripe')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-200">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200 ${method === 'stripe' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.stripe_logo} alt="" className="h-5 mx-4" />
            </div>
            <div onClick={() => setMethod('razorpay')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-200">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200 ${method === 'razorpay' ? 'bg-green-400' : ''}`}></p>
              <img src={assets.razorpay_logo} alt="" className="h-5 mx-4" />
            </div>
            <div onClick={() => setMethod('cod')} className="flex items-center gap-3 border p-2 px-3 cursor-pointer border-gray-200">
              <p className={`min-w-3.5 h-3.5 border rounded-full border-gray-200 ${method === 'cod' ? 'bg-green-400' : ''}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">CASH ON DELIVERY</p>
            </div>
          </div>
          <div className='w-full text-end mt-8'>
            <button type='submit' className='bg-black text-white text-sm px-16 py-3 cursor-pointer'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
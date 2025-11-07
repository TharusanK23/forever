import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const Verify = () => {

    const {navigate, token, setCartItems, baseApiUrl} = useContext(ShopContext);
    const [searchParams, setSearchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');
    const success = searchParams.get('success');

    const verifyPayment = async () => {
        try {
            if(!token) {
                return null;
            }
            const res = await axios.post(baseApiUrl + "/api/order/verifystripe", {orderId, success}, {headers: {Authorization : token}});
            if(res.data.success) {
                setCartItems({});
                toast.success(res.data.message);
                navigate('/orders');
            } else {
                toast.error(res.data.message);
                navigate('/cart');
            }
        } catch (error) {
            if(error.status == 400) {
                toast.error(error.response.data.message);
            } else {
                toast.error(error.message);
            }
            navigate('/cart');
        }
    }

    useEffect(() => {
        verifyPayment();
    }, [token]);

  return (
    <div>Verify</div>
  )
}

export default Verify
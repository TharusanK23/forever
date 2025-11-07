import axios from "axios";
import { useState } from "react";
import { baseApiUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({setToken}) => {

    const [email, setEmail] = useState('forever.admin@forever.com');
    const [password, setPassword] = useState('Tharu@2315');

    const onSubmithandler = async (e) => {
        try {
            e.preventDefault();
            const res = await axios.post(baseApiUrl + '/api/user/admin', {email, password});
            
            if(res.data.success) {
                setToken('Bearer ' + res.data.result.token);
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

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
        <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
            <h1 className='text-2xl font-bold mb-4'>Admin Panel</h1>
            <form>
                <div className='mb-3 min-w-75'>
                    <p>Email Address</p>
                    <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" placeholder='your@email.com' className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' required />
                </div>
                <div className='mb-3 min-w-75'>
                    <p>Password</p>
                    <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" placeholder='Password' className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none' required />
                </div>
                <button onClick={onSubmithandler} type="submit" className='mt-2 w-full cursor-pointer py-2 px-4 rounded-md text-white bg-black'>Login</button>
            </form>
        </div>
    </div>
  )
}

export default Login
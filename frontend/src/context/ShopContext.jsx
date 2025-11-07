import { createContext, useEffect, useState } from "react";
//import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const baseApiUrl = import.meta.env.VITE_API_URL;
    const currency = import.meta.env.VITE_CURRENCY_SYMBOL;
    const delivery_fee = 10;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, size) => {

        if(token) {

            if(!size) {
                toast.error('Select Product Size');
                return;
            }
            let cartData = structuredClone(cartItems);
            if(cartData[itemId]) {
                if(cartData[itemId][size]) {
                    cartData[itemId][size] += 1;
                } else {
                    cartData[itemId][size] = 1;
                }
            } else {
                cartData[itemId] = {};
                cartData[itemId][size] = 1;
            }
            setCartItems(cartData);

            try {
                await axios.post(baseApiUrl + "/api/cart/add", {itemId, size}, {headers: {Authorization : token}});
            } catch (error) {
                if(error.status == 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            }
        } else {
            navigate('/login');
        }
    }

    const getCartCount = () => {
        let totalCount = 0;
        for(const items in cartItems) {
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalCount;
    }

    const updateQuantity = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
        if(token) {
            try {
                await axios.put(baseApiUrl + "/api/cart/update", {itemId, size, quantity}, {headers: {Authorization : token}});
            } catch (error) {
                if(error.status == 400) {
                    toast.error(error.response.data.message);
                } else {
                    toast.error(error.message);
                }
            }
        } else {
            toast.info('Login to save your cart items');
        }
    }

    const getCartAmout = () => {
        let totalAmount = 0;
        for(const items in cartItems) {
            let itemInfo = products.find(prod => prod._id === items);
            for(const item in cartItems[items]) {
                try {
                    if(cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                    
                }
            }
        }
        return totalAmount;
    }

    const getProducts = async () => {
        try {
            const res = await axios.get(baseApiUrl + "/api/product/list");
            if(res.data.success) {
                setProducts(res.data.result);
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

    const getUserCart = async (token) => {
        try {
            const res = await axios.post(baseApiUrl + "/api/cart/items", {}, {headers: {Authorization : token}});
            if(res.data.success) {
                setCartItems(res.data.result);
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
        getProducts();
    }, []);

    useEffect(() => {
        if(!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    }, []);

    const value = {
        baseApiUrl, products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, setCartItems,
        getCartCount, updateQuantity,
        getCartAmout, navigate,
        token, setToken, getUserCart
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
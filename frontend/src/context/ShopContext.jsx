import { createContext, useContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 100;
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [searchbar, setSearchbar] = useState(false);
    const [cartItems, setCartItems] = useState({});
    const [products, setProducts] = useState([]);
    const [token,setToken] = useState('');
    const navigate = useNavigate();

    const addToCart = async (itemId, variant) => {
        if (!variant) {
            toast.error('Select Product Variant');
            return;
        }
        let cartData = structuredClone(cartItems);
        if (cartData[itemId]) {
            if (cartData[itemId][variant]) {
                cartData[itemId][variant] += 1;
            }
            else {
                cartData[itemId][variant] = 1;
            }
        }
        else {
            cartData[itemId] = {};
            cartData[itemId][variant] = 1;
        }
        setCartItems(cartData);

        if(token){
            try {
                await axios.post(backendURL+ '/api/cart/add', {itemId, variant}, {headers:{token}})
            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            }
        }
    }

    const cartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalCount += cartItems[items][item];
                    }
                } catch (error) {

                }
            }
        }
        return totalCount;
    }

    const updateQty = async (itemId, variant, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][variant] = quantity;
        setCartItems(cartData);
        if(token){
            try {
                await axios.post(backendURL+ '/api/cart/update', {itemId, variant, quantity}, {headers:{token}})
            } catch (error) {
                console.log(error.message);
                toast.error(error.message);
            }
        }
    }

    const cartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            for (const item in cartItems[items]) {
                try {
                    if (cartItems[items][item] > 0) {
                        totalAmount += itemInfo.price * cartItems[items][item];
                    }
                } catch (error) {
                }
            }
        }
        return totalAmount;
    }

    const getProductsData = async () => {
        try {
            const response = await axios.get(backendURL + '/api/product/list');
            console.log(response.data);
            if(response.data.success){
                setProducts(response.data.products);
            }
            else{
                toast.error(response.data.message);
            }
        }
        catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    const getUserCart = async (token) =>{
        try {
            const response = await axios.post(backendURL+'/api/cart/get',{},{headers:{token}})
            if(response.data.success){
                console.log(response.data.cartData);
                setCartItems(response.data.cartData);
            }
        
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    useEffect(() => {
        getProductsData();
    }, []);

    useEffect(()=>{
        if(!token && localStorage.getItem('token')){
            setToken(localStorage.getItem('token'));
            getUserCart(localStorage.getItem('token'));
        }
    },[])

    const value = {
        products, currency, delivery_fee,
        search, setSearch, searchbar, setSearchbar,
        cartItems, addToCart, cartCount, updateQty, cartAmount,
        navigate, backendURL, token , setToken
    }

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider;
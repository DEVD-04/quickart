import { createContext, useContext, useEffect, useState } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import {useNavigate} from "react-router-dom";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = '₹';
    const delivery_fee = 100;
    const [search, setSearch] = useState('');
    const [searchbar, setSearchbar] = useState(false);
    const [cartItems, setCartItems] = useState({});
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

    const updateQty = async (itemId, variant, qty) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][variant] = qty;
        setCartItems(cartData);
    }

    const cartAmount = ()=> {
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

        const value = {
            products, currency, delivery_fee,
            search, setSearch, searchbar, setSearchbar,
            cartItems, addToCart, cartCount, updateQty, cartAmount,
            navigate,
        }

        return (
            <ShopContext.Provider value={value}>
                {props.children}
            </ShopContext.Provider>
        )
    }

    export default ShopContextProvider;
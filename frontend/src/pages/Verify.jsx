import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Verify = () => {

    const {navigate, token, setCartItems, backendURL} =useContext(ShopContext);
    const [serachParams, setSerachParams] = useSearchParams();

    //gets value from url, and url is set at backend of stripe payment controller
    const success = serachParams.get('success');
    const orderId = serachParams.get('orderId');

    const verifyPayment = async () =>{
        try {
            if(!token){
                return null;
            }
            const response = await axios.post(backendURL+'/api/order/verifystripe',{success,orderId}, {headers:{token}});
            if(response.data.success){
                setCartItems([]);
                navigate('/orders');
                toast.success('Payment Successful')
            }
            else{
                navigate('/cart');
                toast.error('Payment failed');
            }
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    }

    //need to run verifyPayment func when the page is loaded
    useEffect(()=>{
        verifyPayment();
    },[token])

  return (
    <div>
      
    </div>
  )
}

export default Verify

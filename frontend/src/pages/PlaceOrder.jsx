import React, { useContext, useState } from 'react'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {

  const {navigate, backendURL, token, cartItems, setCartItems, cartAmount, delivery_fee, products} = useContext(ShopContext);
  const [method, setMethod] = useState('cod');
  const [formData,setFormData] = useState({
    name:'',
    email:'',
    address:'',
    pin:'',
    city:'',
    state:'',
    phone:''
  })

  // to set the value of state variables
  const onChangeHandler = (event) =>{
    const name=event.target.name;
    const value=event.target.value;
    setFormData(data=>({...data, [name]:value}));
  }

  const onsubmitHandler = async (e)=>{
    e.preventDefault();
    try {
      let orederItems = [];
      for(const items in cartItems){
        for(const item in cartItems[items]){
          if(cartItems[items][item]>0){
            const itemInfo = structuredClone(products.find(product => product._id === items))
            if(itemInfo){
              itemInfo.variant = item;
              itemInfo.quantity = cartItems[items][item];
              orederItems.push(itemInfo);
            }
          }
        }
      }
      
      let orderData = {
        address: formData,
        items: orederItems,
        amount: cartAmount()+delivery_fee
      }

      switch(method){
        case 'cod':
          const response = await axios.post(backendURL + '/api/order/place', orderData, {headers:{token}});
          if(response.data.success){
            setCartItems({});
            navigate('/orders');
            toast.success('order placed');
          }
          else{
            toast.error('order not placed');
          }
        break;

        case 'stripe':
          const responseStripe = await axios.post(backendURL+ '/api/order/stripe', orderData, {headers:{token}});
          if(responseStripe.data.success){
            const {session_url}= responseStripe.data; // gets the url which we sent from backend for success/failure
            window.location.replace(session_url)
          }
          else{
            toast.error(responseStripe.data.message);
          }
        break;

        default:
          break;
      }

    } catch (error) {
      console.log(error.message);
      toast.error(error.message);
    }
  }
  

  return (
    <form onSubmit={onsubmitHandler} className='flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-top'>

      <div className='flex flex-col gap-4 w-full sm:max-w-[480px'>
        <div className='text-xl sm:text-2xl my-3'>
          <Title text1={'DELIVERY'} text2={' DETAILS'} />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='name' value={formData.name} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="text" placeholder='Name' />
        </div>
        <input onChange={onChangeHandler} name='email' value={formData.email} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="email" placeholder='Email Address' />
        <div>
        <input onChange={onChangeHandler} name='address' value={formData.address} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="text" placeholder='Address' />
        <input onChange={onChangeHandler} name='pin' value={formData.pin} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="number" placeholder='Pin' />
        </div>
        <div className='flex gap-3'>
          <input onChange={onChangeHandler} name='city' value={formData.city} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="text" placeholder='City' />
          <input onChange={onChangeHandler} name='state' value={formData.state} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="text" placeholder='State' />
        </div>
        <input onChange={onChangeHandler} name='phone' value={formData.phone} required className='border-gray-300 rounded-py-1.5 px-3.5 w-full' type="number" placeholder='Phone Number' />
      </div>

      <div className='mt-8'>
        <div className='mt-8 min-w-80'>
          <CartTotal />
        </div>
        <div className='mt-12'>
          <Title text1={'PAYMENT'} text2={' METHOD'} />
          <div className='flex gap-3 flex-col lg:flex-row'>
            <div onClick={()=>setMethod('stripe')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method ==='stripe' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.stripe_logo} alt="" />
            </div>
            {/* <div onClick={()=>setMethod('razor')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method ==='razor' ? 'bg-green-400' : ''}`}></p>
              <img className='h-5 mx-4' src={assets.razorpay_logo} alt="" />
            </div> */}
            <div onClick={()=>setMethod('cod')} className='flex items-center gap-3 border p-2 px-3 cursor-pointer'>
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method ==='cod' ? 'bg-green-400' : ''}`}></p>
            <p className= 'text-gray-500 text-sm font-medium mx-4'>CASH ON DELIVERY</p>
          </div>
        </div> 
        <div className='w-full text-end mt-8'>
          <button type='submit' className='bg-black text-white px-16 py-3 text-sm'>PLACE ORDER</button>
        </div>
      </div>
    </div>
    
    </form >
  )
}

export default PlaceOrder

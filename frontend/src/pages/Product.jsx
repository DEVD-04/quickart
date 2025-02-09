import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets.js'
import RelatedProd from '../components/RelatedProd.jsx';

const Product = () => {

  const { productId } = useParams(); //getting what is after : in path
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [variant, setvariant] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        // console.log(item);
        return null;
      }
    })
  }

  useEffect(() => {
    fetchProductData();
  }, [productId, products])  // whenever prodId updated it will run

  return productData ? (
    <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
      {/* Product Data */}
      <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
        {/* Product Images */}
        <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
          <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[20%] w-full'>
            {
              productData.image.map((item, index) => (
                <img onClick={() => setImage(item)} src={item} key={index} className='w-[30%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' alt="" />
              ))
            }
          </div>
          <div className='w-[80%] sm:w-[50%]'>
            <img src={image} className='w-full h-auto' alt="" />
          </div>
          {/* -------- Product Info ------- */}
          <div className='flex-1'>
            <h1 className='font-medium text-2xl mt-2'>{productData.name}</h1>
            <div className=' flex items-center gap-1 mt-2'>
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className='pl-2'>(1)</p>
            </div>
            <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
            <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>
            <div className='flex flex-col gap-4 my-8'>
              <p>Select Variant</p>
              <div className='flex gap-2'>
                {productData.variants.map((item,index)=>(
                  <button onClick={()=>setvariant(item)} className={`border py-2 px-4 bg-gray-100 ${item === variant ? 'border-orange-500' : ''}`} key={index}>{item}</button>
                ))}
              </div>
            </div>
          <button onClick={()=>addToCart(productData._id, variant)} className='bg-black text-white px-8 py-3 text-sm active:bg-gray-700'>ADD TO CART</button>
          <hr className='mt-8 sm:w-4/5'/>
          </div>
        </div>
      </div>
      {/* related products */}
      <RelatedProd category={productData.category} id={productData._id} />
    </div>
  ) :
    <div className='opacity-0'></div>
}

export default Product

import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';


const Collection = () => {
  const { products, search, searchbar } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterproducts]=useState([]);
  const [category, setCategory] = useState([]);
  const [sortType,setSortType] = useState('relevance')

  const toggleCategory = (e) => {
    // e event will give what category is chosen via e.target.value
    //  if that already present in category array then it means untick, so remove it from array
    // if not present then it means tick. add in category array
    if(category.includes(e.target.value)){
      setCategory(prev=> prev.filter(item=> item!==e.target.value));
      // untick case
      // prev means previous category array where e.target.value already present
      //  modify it by deleting category that are  equal to e.target.value
    }
    else{
      setCategory(prev => [...prev,e.target.value]);
      // tick case
      // prev is older category Array, spread it and add new e.target.value
    }
  }

  const applyFilter = () => {
    let productsCopy=products.slice();
    if(searchbar && search){
      productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
    }
    if(category.length > 0){
      productsCopy = productsCopy.filter(item => category.includes(item.category));
    }
    setFilterproducts(productsCopy);
  }

  const sortProduct = () =>{
    let filterProductCopy = filterProducts.slice();
    switch(sortType){

      case 'low-high':
        setFilterproducts(filterProductCopy.sort((a,b)=>a.price-b.price));
        break;

      case 'high-low':
        setFilterproducts(filterProductCopy.sort((a,b)=>b.price-a.price));
        break;

      default:
        // if no sort selected just apply filter by calling applyFilter function 
        // which checks if any filter was there if yes then loads those only else loads all
        applyFilter();
        break;
    } 
  }

  useEffect(()=>{
    applyFilter();
  },[category, search, searchbar, products])

  useEffect(()=>{
    sortProduct();
  },[sortType])

  // useEffect(()=>{
  //   console.log(category);
  // },[category])

  return (
    <div className='flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t '>

      {/* filter */}
      <div className='min-w-60'>
        <p onClick={() => setShowFilter(!showFilter)} className='my-2 text-xl flex items-center cursor-pointer gap-2'>FILTERS
          <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`} src={assets.dropdown_icon} alt="" />
        </p>
        {/* Category Filter */}
        <div className={`border border-gray-300 pl-5 py-3 mt-6 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Phone'} onChange={toggleCategory}/> Phone
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Laptop'} onChange={toggleCategory}/> Laptop
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Watch'} onChange={toggleCategory}/> Watch
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Headphone'} onChange={toggleCategory}/> Headphone
            </p>
          </div>
        </div>
        {/* sub category
        <div className={`border border-gray-300 pl-5 py-3 my-5 ${showFilter ? '' : 'hidden'} sm:block`}>
          <p className='mb-3 text-sm font-medium'>TYPE</p>
          <div className='flex flex-col gap-2 text-sm font-light text-gray-700'>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Samsung'} /> Samsung
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Apple'} /> Apple
            </p>
            <p className='flex gap-2'>
              <input className='w-3' type="checkbox" value={'Google'} /> Google
            </p>
          </div>
        </div> */}
      </div>

      {/* Right Side */}
      <div className='flex-1'>
        <div className='flex justify-between text-base sm:text-2xl mb-4'>
          <Title text1={'ALL'} text2={' COLLECTIONS'} />
          {/* Porduct Sort */}
          <select onChange={(e)=>setSortType(e.target.value)} className='border-2 border-gray-300 text-sm px-2'>
            <option value="relevance">Sort by: Relevance</option>
            <option value="low-high">Sort by: Price Low to High</option>
            <option value="high-low">Sort by: Price High to Low</option>
          </select>
        </div>

        {/* map products */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6'>
          {
            filterProducts.map((item,index)=>(
              <ProductItem key={index} name={item.name} id={item._id} price={item.price} 
              image={item.image} />
            ))
          }
        </div>

      </div>



      
    </div>
  )
}

export default Collection

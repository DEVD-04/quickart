import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import axios from 'axios';
import { backendURL } from '../App';
import { toast } from 'react-toastify';

const Add = ({token}) => {
    
    const [image1, setImage1] = useState(false);
    const [image2, setImage2] = useState(false);
    const [image3, setImage3] = useState(false);
    const [image4, setImage4] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory]= useState('Phone');
    const [variant, setVariant] = useState([]);
    const [bestseller, setBestseller] = useState(false);


    const getVariants = () => {
        switch(category) {
            case 'Phone':
                return ['64GB', '128GB', '256GB'];
            case 'Laptop':
                return ['14 inch', '16 inch'];
            case 'Watch':
                return ['42mm', '44mm'];
            case 'Headphone':
                return ['Normal'];
            default:
                return [];
        }
    }

    const handleVariantChange = (e) => {
        const selectedVariants = Array.from(e.target.selectedOptions, option => option.value);
        setVariant(selectedVariants);
    }

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name",name);
            formData.append("description",description);
            formData.append("category",category);
            formData.append("price",price);
            formData.append("bestseller",bestseller);
            formData.append("variant", JSON.stringify(variant));

            image1 && formData.append("image1",image1);
            image2 && formData.append("image2",image2);
            image3 && formData.append("image3",image3);
            image4 && formData.append("image4",image4);

            const response = await axios.post(backendURL+'/api/product/add', formData, {headers:{token}});
            if(response.data.success){
                toast.success(response.data.message);
                setName('');
                setDescription('');
                setPrice('');
                setVariant([]);
                setImage1(false);
                setImage2(false);
                setImage3(false);
                setImage4(false);
                setBestseller(false);
            }
            else{
                toast.error(response.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(response.data.message);
        }
    }

    return (
        <form onSubmit={onSubmitHandler} action="" className='flex flex-col w-full items-start gap-3'>
            <div>
                <p className='mb-2'>Upload Image</p>
                <div className='flex gap-2'>
                    <label htmlFor="image1">
                        <img className='w-20' src={!image1 ? assets.upload_area : URL.createObjectURL(image1)} alt="" />
                        <input onChange={(e)=>setImage1(e.target.files[0])} type="file" id="image1" hidden />
                    </label>
                    <label htmlFor="image2">
                        <img className='w-20' src={!image2 ? assets.upload_area : URL.createObjectURL(image2)} alt="" />
                        <input onChange={(e)=>setImage2(e.target.files[0])} type="file" id="image2" hidden />
                    </label>
                    <label htmlFor="image3">
                        <img className='w-20' src={!image3 ? assets.upload_area : URL.createObjectURL(image3)} alt="" />
                        <input onChange={(e)=>setImage3(e.target.files[0])} type="file" id="image3" hidden />
                    </label>
                    <label htmlFor="image4">
                        <img className='w-20' src={!image4 ? assets.upload_area : URL.createObjectURL(image4)} alt="" />
                        <input onChange={(e)=>setImage4(e.target.files[0])} type="file" id="image4" hidden />
                    </label>
                </div>
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product Name</p>
                <input onChange={(e)=>setName(e.target.value)} value={name} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Enter Product Name' required />
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product Description</p>
                <textarea onChange={(e)=>setDescription(e.target.value)} value={description} className='w-full max-w-[500px] px-3 py-2' type="text" placeholder='Enter Product Description' required />
            </div>
            <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
                <div>
                    <p className='mb-2'>Product Category</p>
                    <select className='w-full px-3 py-2' value={category} onChange={(e)=>setCategory(e.target.value)}>
                        <option value="Phone">Phone</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Watch">Watch</option>
                        <option value="Headphone">Headphone</option>
                    </select>
                </div>
                <div>
                    <p className='mb-2'>Product Price</p>
                    <input onChange={(e)=>setPrice(e.target.value)} value={price} className='w-full px-3 py-2 sm:w-[120px]' type="Number" />
                </div>
            </div>
            <div className='w-full'>
                <p className='mb-2'>Product Variants</p>
                <select multiple onChange={handleVariantChange} value={variant} className='w-full max-w-[500px] px-3 py-2'>
                    {getVariants().map((variantOption, index) => (
                        <option key={index} value={variantOption}>{variantOption}</option>
                    ))}
                </select>
            </div>
            <div>
                <input onChange={()=>setBestseller(prev => !prev)} checked={bestseller} type="checkbox" id='bestseller' />
                <label className='cursor-pointer' htmlFor="bestseller">Add to Bestseller</label>
            </div>
            <button type='submit' className='w-40 py-3 mt-4 bg-black text-white'>ADD PRODUCT</button>
        </form>
    )
}

export default Add

import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
    return (
        <div>
            <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
                <div>
                    <img src={assets.logo} className='mb-5 h-24' alt="" />
                </div>
                <div>
                    <p className='text-xl font-medium mb-2'>QUICKART</p>
                    <p className='text-l font-medium'>support@quickart.com</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Footer

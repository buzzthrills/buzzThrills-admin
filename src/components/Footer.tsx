import React from 'react';
// import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { logo } from '../assets';

const Footer:React.FC = () => {


    const navigate = useNavigate()
    return (
        <div>
            <div className='flex text-white bg-purple-800 px-4 flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14  mt-40 text-sm'>

                <div>
                    <h4 onClick={() => navigate('/')} className=' cursor-pointer text-black text-[26px] font-[600] mb-5 '><img className='w-32 -mb-12 -ml-6' src={logo} alt="" /></h4>
                    <p className='w-full md:w-2/3 text-gray-400'>
                        Looking for quality service you can trust?
                        We offer exceptional care, great value, and a smooth booking experience.
                        Slots fill up fast—book your service now and let’s take care of you!
                    </p>
                </div>
                <div >
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-400'>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Bookings</li>
                        <li>Privacy Policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        {/* <li>+2349102449764</li> */}
                        <li>buzz</li>
                    </ul>
                </div>

            </div>

            <div >
                <hr />
                <p className='py-5 text-[8px] bg-purple-800 text-white  text-center'> Copyright 2025 by Daniel Success - all right Reserve</p>
            </div>
        </div>
    );
}

export default Footer;

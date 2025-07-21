import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';

const Navbar = ({isLoggedIn, setIsLoggedIn}) => {
  const [nav, setNav] = useState(false);
  const navigate = useNavigate();


const handleLogout = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
      method: 'POST',
    });

    if (res.ok) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/sign_in');
    } else {
      console.error('Logout failed:', res.status);
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};


  const handleNav = () => {
    setNav(!nav);
  };



  return (
    <div className='sticky top-0 z-50 flex justify-between items-center h-24 max-w-[1240px] mx-auto px-4 bg-[#e1edff] text-black'>
      <h1 className='w-full text-3xl font-bold text-[#00df9a]'>Inventory.</h1>
      
      {/* Desktop Menu */}
      <ul className='hidden md:flex items-center'>
        <li className='p-4'>
          <NavLink to='/' className='hover:underline'>Home</NavLink>
        </li>
        <li className='p-4'>
          <NavLink to='/products' className='hover:underline'>Products</NavLink>
        </li>
        <li className='p-4'>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className='bg-red-500 w-[130px] rounded-md font-medium my-6 mx-auto py-3 text-white hover:bg-red-600 cursor-pointer'
        >
          Log Out
        </button>
      ) : (
        <NavLink to='/sign_in'>
          <button className='bg-[#00df9a] w-[130px] rounded-md font-medium my-6 mx-auto py-3 text-white hover:bg-[#00c481] cursor-pointer'>
            Log In
          </button>
        </NavLink>
      )}
    </li>
      </ul>

      {/* Mobile Toggle */}
      <div onClick={handleNav} className='block md:hidden cursor-pointer'>
        {nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Menu */}
      <ul className={nav 
        ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-500'
        : 'ease-in-out duration-500 fixed left-[-100%]'}>
        
        <h1 className='w-full text-3xl font-bold text-[#00df9a] m-4'>Inventory.</h1>

        <li className='p-4 border-b border-gray-600 text-white'>
          <NavLink to='/' onClick={() => setNav(false)}>Home</NavLink>
        </li>
        <li className='p-4 border-b border-gray-600 text-white'>
          <NavLink to='/products' onClick={() => setNav(false)}>Products</NavLink>
        </li>
        {/* <li className='p-4'>
          <NavLink to='/sign_in' onClick={() => setNav(false)}>
            <button className='bg-[#00df9a] w-[80px] rounded-md my-4 mx-auto py-2 text-white hover:bg-[#00c481] cursor-pointer'>
              Log In
            </button>
          </NavLink>
        </li> */}


        <li className='p-4'>
      {isLoggedIn ? (
        <button
          onClick={handleLogout}
          className='bg-red-500 w-[80px] rounded-md my-4 mx-auto py-2 text-white hover:bg-red-600 cursor-pointer'
        >
          Log Out
        </button>
      ) : (
        <NavLink to='/sign_in'>
          <button className='bg-[#00df9a] w-[80px] rounded-md my-4 mx-auto py-2 text-white hover:bg-[#00c481] cursor-pointer'>
            Log In
          </button>
        </NavLink>
      )}
    </li>
        
      </ul>
    </div>
  );
};

export default Navbar;

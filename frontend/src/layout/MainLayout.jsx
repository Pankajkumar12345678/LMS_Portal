import Navbar from '@/components/Navbar'
import { Toaster } from "@/components/ui/sonner"
import { userLoggedIn } from '@/features/authSlice';
import { useAuthStore } from '@/store/authStore';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom'

const MainLayout = () => {

    const dispatch=useDispatch()
     const { user } = useAuthStore();
     
     
  	useEffect(() => {
    if (user) {
      dispatch(userLoggedIn({ user }));
      console.log("react redux data strore in react state")
    } 
  }, [dispatch]);

  return (
    <div className='flex flex-col min-h-screen '>
        <Navbar/>
        <div className='flex-1 mt-10'>
            <Outlet/>
        </div>
        <Toaster/>
    </div>
  )
}

export default MainLayout
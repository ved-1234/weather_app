import { useState } from 'react'
import {createBrowserRouter,RouterProvider} from 'react-router-dom'
import Account from './components/account'
import Weather from './components/weather'
import OTPVerification from './components/verification'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import Home from './components/home'
import Verification from './components/verification'
function App() {
  const router=createBrowserRouter([
  {
 path:'/',
 element: <Home />
  },
    {
    path:'/account',
    element:<Account />
    },
    {
      path:'/weather',
      element:<Weather />
    },
    {
 path:'/verification',
 element:<Verification/>
    }
  ])

  return (
    <>
    
     <RouterProvider router={router} />
    </>
  )
}

export default App

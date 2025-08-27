import React from 'react'
import Layout from './components/Layout'
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className='no-scrollbar'>
    <Layout />
    <ToastContainer position="top-right" autoClose={3000} />
    </div>
  )
}

export default App
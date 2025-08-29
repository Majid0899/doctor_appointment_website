import React from 'react'
import { Navigate } from 'react-router-dom'

const Appointments = () => {

    if(!localStorage.getItem("token")){
        return <Navigate to="/signup"/>

    }
  return (
    <div>Appointments</div>
  )
}

export default Appointments
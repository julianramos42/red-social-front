import React, { useEffect } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'

export default function Index() {
  const navigate = useNavigate()

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/auth')
    }
  },[])

  return (
    <div>
      <NavBar/>
    </div>
  )
}

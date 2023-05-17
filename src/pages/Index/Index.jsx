import React, { useEffect } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()

  useEffect( () => {
    const token = localStorage.getItem('token')
    if(!token){
      navigate('/auth')
    }
  },[])

  return (
    <div>Index</div>
  )
}

import React from 'react'
import Login from '../../components/Login/Login'
import Register from '../../components/Register/Register'
import { useState } from 'react'

export default function Auth() {
  const [state,setState] = useState(true)
  return (
    <div>
        {
          state ? <Login setState={setState}/> : <Register setState={setState}/>
        }
    </div>
  )
}
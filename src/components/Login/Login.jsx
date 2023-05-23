import React from 'react'
import './login.css'
import { useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import {LoadStart, LoadRemove} from '../Loading'
import { Link as Anchor } from 'react-router-dom'

export default function Login({setState}) {
  const dataForm = useRef()
  const navigate = useNavigate()

  async function handleLogin(e) {
    try {
      LoadStart()
      e.preventDefault()
      let data = {
        email: dataForm.current[1].value,
        password: dataForm.current[3].value
      }
      let url = 'http://localhost:8080/users/signin'
      const res = await axios.post(url, data)
      toast.success(res.data.message)
      let userData = {
        user_id: res.data.user._id,
        photo: res.data.user.photo,
        name: res.data.user.name,
        last_name: res.data.user.last_name
      }
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(userData))
      setTimeout( () => {
        LoadRemove()
        navigate('/')
      }, 1000)
    } catch (error) {
      LoadRemove()
      if (error.code === "ERR_NETWORK") {
        toast.error("Network Error");
      } else {
        if (typeof error.response.data.message === "string") {
          toast.error(error.response.data.message);
        } else {
          error.response.data.message.forEach((err) => toast.error(err));
        }
      }
    }
  }

  function handleRender(){
    LoadStart()
    setTimeout( () => {
      LoadRemove()
      setState(false)
    }, 1000)
  }

  return (
    <div className='login-main'>
      <div className='login-form'>
        <section className='login-title'>
          <h2>Login</h2>
          <h3>Welcome back! Please login to your account</h3>
        </section>
        <form ref={dataForm} onSubmit={handleLogin}>
          <fieldset>
            <input type='email' name='email' id='email' placeholder='Email' />
          </fieldset>
          <fieldset>
            <input type='password' name='password' id='password' placeholder='*************' />
          </fieldset>
          <input className='login-btn' type='submit' value='Login' />
        </form>
        <p>You don´t have an account yet? <Anchor className='link' onClick={handleRender}>Register</Anchor></p>
      </div>
    </div>
  )
}

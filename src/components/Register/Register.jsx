import React from 'react'
import './register.css'
import { useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { LoadStart, LoadRemove } from '../Loading'
import { Link as Anchor } from 'react-router-dom'

export default function Register({setState}) {
    const dataForm = useRef()
    
    async function handleRegister(e) {
        try {
            LoadStart()
            e.preventDefault()
            let data = {
                name: dataForm.current[1].value,
                photo: dataForm.current[3].value,
                email: dataForm.current[5].value,
                password: dataForm.current[7].value
            }
            let url = 'https://red-social-jr.onrender.com/users/signup'
            const res = await axios.post(url, data)
            toast.success(res.data.message)
            localStorage.setItem('token', res.data.token)
            setTimeout(() => {
                LoadRemove()
                setState(true)
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
          setState(true)
        }, 1000)
      }

    return (
        <div className='register-main'>
            <div className='register-form'>
                <section className='register-title'>
                    <h2>Register</h2>
                    <h3>Welcome! Please register to create your account</h3>
                </section>
                <form ref={dataForm} onSubmit={handleRegister}>
                    <fieldset>
                        <input type='text' name='name' id='name' placeholder='Name' />
                    </fieldset>
                    <fieldset>
                        <input type='text' name='photo' id='photo' placeholder='Photo URL or Leave Blank' />
                    </fieldset>
                    <fieldset>
                        <input type='email' name='email' id='email' placeholder='Email' />
                    </fieldset>
                    <fieldset>
                        <input type='password' name='password' id='password' placeholder='*************' />
                    </fieldset>
                    <input className='register-btn' type='submit' value='Register' />
                </form>
                <p>Already have an account? <Anchor className='link' onClick={handleRender}>LogIn</Anchor></p>
            </div>
        </div>
    )
}

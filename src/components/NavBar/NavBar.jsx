import React, { useState } from 'react'
import './navBar.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { LoadStart, LoadRemove } from '../Loading'

export default function NavBar() {
    const [navOpen, setNavOpen] = useState(false)
    const navigate = useNavigate()

    function openNav() {
        setNavOpen(true)
    }

    function closeNav() {
        setNavOpen(false)
    }

    async function logOut() {
        try {
            LoadStart()
            let url = 'http://localhost:8080/users/signout'
            const token = localStorage.getItem('token');
            const headers = { headers: { Authorization: `Bearer ${token}` } };
            const res = await axios.post(url,null,headers)
            toast.success(res.data.message)
            localStorage.removeItem('token')
            setTimeout(() => {
                LoadRemove()
                navigate('/auth')
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

    return (
        <div className='navContainer'>
            <nav className={navOpen ? 'containerNavStore' : 'containerNavStoreClosed'}>
                <div className='icon'>
                    <i className="fa-solid fa-house"></i>
                    <h4>Home</h4>
                </div>
                <div className='icon'>
                    <i className="fa-solid fa-comments"></i>
                    <h4>Chats</h4>
                </div>
                <div className='icon'>
                    <i className="fa-solid fa-people-group"></i>
                    <h4>Network</h4>
                </div>
                <div className='icon logout' onClick={logOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <h4>LogOut</h4>
                </div>
                <i className="fa-solid fa-arrow-left arrow-l" onClick={closeNav}></i>
            </nav>
            <i className="fa-solid fa-arrow-right arrow-r" onClick={openNav}></i>
            <h1>asd</h1>
        </div>
    )
}

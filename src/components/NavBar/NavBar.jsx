import React, { useState } from 'react'
import './navBar.css'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { LoadStart, LoadRemove } from '../Loading'
import { Link as Anchor } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import modalActions from '../../store/NotificationsModal/actions.js'

const { renderModal } = modalActions

export default function NavBar() {
    const [navOpen, setNavOpen] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

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
            const res = await axios.post(url, null, headers)
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

    function openModal() {
        dispatch(renderModal({ state: true }))
        setNavOpen(false)
    }

    return (
        <div className='navContainer'>
            <nav className={navOpen ? 'containerNavStore' : 'containerNavStoreClosed'}>
                <Anchor to='/' className='icon'>
                    <i className="fa-solid fa-house"></i>
                    <p>Home</p>
                </Anchor>
                <Anchor to='/chats' className='icon'>
                    <i className="fa-solid fa-comments"></i>
                    <p>Chats</p>
                </Anchor>
                <Anchor to='/network' className='icon'>
                    <i className="fa-solid fa-people-group"></i>
                    <p>Network</p>
                </Anchor>
                <Anchor className='icon' onClick={openModal}>
                    <i className="fa-solid fa-bell"></i>
                    <p>Notifications</p>
                </Anchor>
                <div className='icon logout' onClick={logOut}>
                    <i className="fa-solid fa-arrow-right-from-bracket"></i>
                    <p>LogOut</p>
                </div>
                <i className="fa-solid fa-arrow-left arrow-l" onClick={closeNav}></i>
            </nav>
            <i className="fa-solid fa-arrow-right arrow-r" onClick={openNav}></i>
        </div>
    )
}

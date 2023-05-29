import React, { useEffect } from 'react'
import './notificationsModal.css'
import { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import modalActions from '../../store/NotificationsModal/actions.js'
import { LoadStart, LoadRemove } from '../../components/Loading'

const {renderModal} = modalActions

export default function NotificationsModal() {
    const [notifications, setNotifications] = useState([])
    const dispatch = useDispatch()
    const userData = JSON.parse(localStorage.getItem('user')) || {}

    async function getNotifications() {
        const url = 'http://localhost:8080/notifications/me'
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try {
            const res = await axios.get(url, headers)
            setNotifications(res.data.notifications)
        } catch (error) {
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

    useEffect(() => {
        getNotifications()
    }, [])

    async function handleAccept(e) {
        LoadStart()
        const id = e.target.id
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        let userid1 = notifications.find(notification => notification._id == id).user_id1._id
        const url1 = 'http://localhost:8080/notifications/'+id
        const data = {
            user_id1: userid1,
            user_id2: userData.user_id
        }   
        const url2 = 'http://localhost:8080/conections/'
        try{
            const res = await axios.post(url2,data,headers)
            toast.success(res.data.message)
            await axios.delete(url1,headers)
            getNotifications()
            LoadRemove()
        }catch (error) {
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

    async function handleReject(e) {
        LoadStart()
        const id = e.target.id
        const url = 'http://localhost:8080/notifications/'+id
        const token = localStorage.getItem('token');
        const headers = { headers: { Authorization: `Bearer ${token}` } };
        try{
            const res = await axios.delete(url,headers)
            toast.success(res.data.message)
            getNotifications()
            LoadRemove()
        }catch (error) {
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

    function closeModal(){
        dispatch(renderModal({state: false}))
    }

    return (
        <div className='modal-container'>
            <div className='modal'>
                <div className='modal-title'>
                    <h3>Friend Requests</h3>
                    <i className="fa-solid fa-x close-modal" onClick={closeModal}></i>
                </div>
                {
                    notifications.length ? notifications.map((notification, i) => {
                        let card = <div className='one-notification' key={i}>
                            <div className='notification-info'>
                                <img src={notification.user_id1.photo} alt='profile-photo' />
                                <h3>{notification.user_id1.name}</h3>
                            </div>
                            <div className='notification-btns'>
                                <i className="fa-solid fa-check" onClick={handleAccept} id={notification._id}></i>
                                <i className="fa-solid fa-x" onClick={handleReject} id={notification._id}></i>
                            </div>
                        </div>
                        return card
                    }) : <div className='no-notification'>
                        <p>No notifications found</p>
                    </div>
                }
            </div>
        </div>
    )
}

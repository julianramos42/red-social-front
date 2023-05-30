import React, { useEffect, useState } from 'react'
import './network.css'
import NavBar from '../../components/NavBar/NavBar'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LoadStart, LoadRemove } from '../../components/Loading'
import { useSelector } from 'react-redux'

export default function Network() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const userData = JSON.parse(localStorage.getItem('user')) || {}
  const [search, setSearch] = useState('')
  const [notifications, setNotifications] = useState([])
  const [conections, setConections] = useState([])
  const modalState = useSelector(store => store.modalReducer.state)
  const token = localStorage.getItem('token')
  const headers = { headers: { Authorization: `Bearer ${token}` } };
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      LoadStart()
      getUsers()
      getNotifications()
      getConections()
    }
  }, [])

  async function getUsers() {
    const url = `https://red-social-jr.onrender.com/users?name=${search}&page=${page}`
    try {
      const res = await axios.get(url, headers)
      setUsers(res.data.users)
      LoadRemove()
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

  async function handleFriendRequest(e) {
    LoadStart()
    let id = e.target.id
    const url = 'https://red-social-jr.onrender.com/notifications'
    let data = {
      user_id1: userData.user_id,
      user_id2: id
    }
    try {
      const res = await axios.post(url, data, headers)
      toast.success(res.data.message)
      getNotifications()
      LoadRemove()
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

  async function getNotifications() {
    const url = 'https://red-social-jr.onrender.com/notifications'
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

  async function getConections() {
    const url = 'https://red-social-jr.onrender.com/conections'
    try {
      const res = await axios.get(url, headers)
      setConections(res.data.conections)
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


  function getSearch(e) {
    setSearch(e.target.value)
  }

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getUsers()
    }
  }, [search])

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getUsers()
      getNotifications()
      getConections()
    }
  }, [modalState])

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getUsers()
    }
  }, [page])

  return (
    <div className='network-container'>
      <NavBar />
      <div className='network'>
        <div className='search-bar'>
          <label htmlFor='search-bar'>
            <i className="fa-solid fa-magnifying-glass"></i>
          </label>
          <input type='text' name='search-bar' id='search-bar' placeholder='Find Someone' onChange={getSearch} />
        </div>
        <div className='network-persons'>
          {
            users.length ?
              users?.map((user, i) => {
                let exists = notifications.some(notification => {
                  return notification.user_id1._id == user._id || notification.user_id2._id == user._id
                })
                let conectionExists = conections.some(conection => {
                  return conection.user_id1._id == user._id || conection.user_id2._id == user._id
                })
                let card = <div className='one-person' key={i}>
                  <div className='person-info'>
                    <img src={user.photo} alt='profile-photo' />
                    <h3>{user.name}</h3>
                  </div>
                  {
                    !exists && conectionExists && <button className='added-friend'>Friends</button>
                  }
                  {
                    exists && !conectionExists && <button className='pending-friend'>Pending</button>
                  }
                  {
                    !exists && !conectionExists && <button className='add-friend' id={user._id} onClick={handleFriendRequest}>Add Friend</button>
                  }
                </div>
                return card
              })
              : <div>
                <p>No users found</p>
              </div>
          }
          {
            users.length || search ? <div className='page-arrows'>
              { page === 1 ? <></> : <i className="fa-solid fa-arrow-left" onClick={() => {setPage(page-1)}}></i> }
              <p>Page - {page}</p>
              { users.length === 10 ? <i className="fa-solid fa-arrow-right" onClick={() => {setPage(page+1)}}></i> : <></> }
            </div>
            : <></>
          }
        </div>
      </div>
    </div>
  )
}
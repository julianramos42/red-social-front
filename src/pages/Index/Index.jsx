import React, { useEffect, useState } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import { useRef } from 'react'
import axios from 'axios'
import { LoadStart, LoadRemove } from '../../components/Loading'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'

export default function Index() {
  const navigate = useNavigate()
  const publicationData = useRef()
  const [publications, setPublications] = useState([])
  const [cantPublications, setCantPublications] = useState('')
  const userData = JSON.parse(localStorage.getItem('user')) || {}
  const modalState = useSelector(store => store.modalReducer.state)
  const token = localStorage.getItem('token')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getPublications()
    }
  }, [])

  async function getPublications() {
    LoadStart()
    const url = `https://red-social-jr.onrender.com/publications?page=${page}`
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.get(url, headers)
      setPublications(res.data.publications)
      setCantPublications(res.data.cantPublications)
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

  async function handlePublication(e) {
    e.preventDefault()
    LoadStart()
    const url = 'https://red-social-jr.onrender.com/publications'
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    const data = {
      text: publicationData.current.value
    }
    try {
      const res = await axios.post(url, data, headers)
      toast.success(res.data.message)
      publicationData.current.value = ''
      getPublications()
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

  async function deletePublication(e) {
    let id = e.target.id
    LoadStart()
    const url = `https://red-social-jr.onrender.com/publications/${id}`
    const token = localStorage.getItem('token');
    const headers = { headers: { Authorization: `Bearer ${token}` } };
    try {
      const res = await axios.delete(url, headers)
      toast.success(res.data.message)
      getPublications()
      LoadRemove()
    } catch (error) {
      console.log(error)
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

  function formatDate(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);

    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  async function deletePublicationQuestion(e) {
    toast(<QuestionToast e={e} />, {
      duration: Infinity
    });
  }

  const QuestionToast = ({ e }) => (
    <div className='toast'>
      <h4>¿Are you sure?</h4>
      <div className='toast-btns'>
        <button className='yes-btn' id={e.target.id} onClick={handleYesClick}>Sí</button>
        <button className='no-btn' onClick={handleNoClick}>No</button>
      </div>
    </div>
  );

  const handleYesClick = (e) => {
    deletePublication(e)
    toast.dismiss();
  };


  const handleNoClick = () => {
    toast.dismiss();
  };

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getPublications()
    }
  }, [modalState])

  useEffect(() => {
    if (!token) {
      navigate('/auth')
    } else {
      getPublications()
    }
  }, [page])


  return (
    <div className='main-container'>
      <NavBar />
      <div className='home'>
        <div className='new-publication'>
          <div className='person'>
            <img src={userData.photo} alt='profile-photo' />
            <h3>{userData.name}</h3>
          </div>
          <form onSubmit={handlePublication}>
            <textarea ref={publicationData} id='new-publication' name='new-publication' placeholder='What are you thinking?' />
            <input type='submit' className='submit-publication' value='Post' />
          </form>
        </div>
        <div className='all-publications'>
          {
            publications.length ?
              publications?.map((publication, i) => {
                let card =
                  <div className="social-post" key={i}>
                    <img src={publication.user_id.photo} alt='profile-photo' className="post-photo" />
                    <div className="post-content">
                      <h3 className="post-name">{publication.user_id.name}</h3>
                      <p className="post-text">{publication.text}</p>
                      <span className="post-date">{formatDate(publication.createdAt)}</span>
                    </div>
                    {
                      publication.user_id._id == userData.user_id ? <div>
                        <i className="fa-solid fa-trash garbage" onClick={deletePublicationQuestion} id={publication._id}></i>
                      </div> : <></>
                    }
                  </div>
                return card
              })
              : <div>
                <p>No posts found</p>
              </div>
          }
          {
            publications.length && publications.length !== cantPublications ? <div>
              <button onClick={() => {setPage(page+1)}} className='show-more-btn'>Show More</button>
            </div> : <></>
          }
        </div>
      </div>
    </div>
  )
}

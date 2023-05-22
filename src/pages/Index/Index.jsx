import React, { useEffect } from 'react'
import './index.css'
import { useNavigate } from 'react-router-dom'
import NavBar from '../../components/NavBar/NavBar'
import { useRef } from 'react'

export default function Index() {
  const navigate = useNavigate()
  const publicationData = useRef()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/auth')
    }
  }, [])

  async function handlePublication(e) {
    e.preventDefault()
    console.log(publicationData.current.value)
  }

  return (
    <div className='main-container'>
      <NavBar />
      <div className='home'>
        <div className='new-publication'>
          <div className='person'>
            <h3>Julián Ramos</h3>
            <p>img</p>
          </div>
          <form onSubmit={handlePublication}>
            <textarea ref={publicationData} id='new-publication' name='new-publication' placeholder='What are you thinking?' />
            <input type='submit' className='submit-publication' value='Post' />
          </form>
        </div>
        <div className='all-publications'>
          {/* <div className="social-post">
            <img src='' alt='' className="post-photo" />
            <div className="post-content">
              <h3 className="post-name">Julián Ramos</h3>
              <p className="post-text">Publicacion de pruebaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaaaa</p>
              <span className="post-date">26/05/2000</span>
            </div>
          </div> */}
          <div>
            <p>No posts found</p>
          </div>
        </div>
      </div>
    </div>
  )
}

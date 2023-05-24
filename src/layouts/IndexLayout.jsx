import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import NotificationsModal from '../components/NotificationsModal/NotificationsModal'
import { useSelector } from 'react-redux'

export default function IndexLayout() {
  const modalState = useSelector(store => store.modalReducer.state)

  return (
    <main>
      <Outlet/>
      {
        modalState ? <NotificationsModal/> : <></>
      }
      <Toaster position='top-right'/>
    </main>
  )
}

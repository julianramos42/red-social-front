import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

export default function IndexLayout() {
  return (
    <main>
      <Outlet/>
      <Toaster position='top-right'/>
    </main>
  )
}

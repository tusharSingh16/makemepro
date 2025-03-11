import Navbar from '@/components/UserFlow/NavBar'
import PreviewPage from '@/components/UserFlow/Preview'
import React, { Suspense } from 'react'

const page = () => {
  return (
    <Suspense>
    <Navbar/>
    <PreviewPage />
    </Suspense>
  )
}

export default page
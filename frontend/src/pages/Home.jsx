import React from 'react'
import { useNavigate } from 'react-router-dom'
import HeroCinematic from '../components/HeroCinematic'

const Home = () => {
  const navigate = useNavigate()

  const handleOpenDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen">
      <HeroCinematic onOpenDashboard={handleOpenDashboard} />
    </div>
  )
}

export default Home

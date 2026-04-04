import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs()
  const { user } = useSelector((store) => store.auth)
  const navigate = useNavigate()

  // Disabled auto-redirect for recruiter so "Home" link works correctly.
  // If you want recruiter to go to admin dashboard by default, add an explicit button.
  // useEffect(() => {
  //   if (user?.role === 'recruiter') navigate('/admin/companies')
  // }, [user, navigate])

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home

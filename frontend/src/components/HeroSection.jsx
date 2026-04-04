import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchHandler = () => {
    dispatch(setSearchedQuery(query))
    navigate('/browse')
  }

  return (
    <div className="text-center py-20 px-4">
      <div className="flex flex-col gap-5 items-center">
        <span className="mx-auto px-4 py-2 rounded-full bg-gray-100 text-[#F83002] font-medium">
          No. 1 Job Hunt Website
        </span>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
          Search, Apply &amp; <br /> Get Your{' '}
          <span className="text-[#6A38C2]">Dream Job</span>
        </h1>
        <p className="text-gray-500 max-w-xl">
          Thousands of jobs from top companies. Find the right role for you and apply in seconds.
        </p>
        <div className="flex w-full max-w-xl shadow-md border border-gray-200 rounded-full items-center gap-4 bg-white px-4 py-2">
          <input
            type="text"
            placeholder="Find your dream job..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && searchHandler()}
            className="outline-none border-none w-full bg-transparent text-sm"
          />
          <Button onClick={searchHandler} className="rounded-full bg-[#6A38C2] hover:bg-[#5b30a6] px-5">
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection

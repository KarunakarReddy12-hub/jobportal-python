import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import Job from './Job'
import Footer from './shared/Footer'
import useGetAllJobs from '@/hooks/useGetAllJobs'
import { useSelector } from 'react-redux'

const Browse = () => {
  useGetAllJobs()
  const { allJobs, searchedQuery } = useSelector((store) => store.job)

  const filtered = searchedQuery
    ? allJobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          j.description?.toLowerCase().includes(searchedQuery.toLowerCase()) ||
          j.location?.toLowerCase().includes(searchedQuery.toLowerCase())
      )
    : allJobs

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 my-10">
        <h1 className="font-bold text-2xl mb-6">
          Search Results{' '}
          {searchedQuery && <span className="text-[#6A38C2]">for "{searchedQuery}"</span>}
          <span className="text-sm font-normal text-gray-500 ml-2">({filtered.length} jobs)</span>
        </h1>
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No jobs found. Try a different search.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job) => (
              <Job key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Browse

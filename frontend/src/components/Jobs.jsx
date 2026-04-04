import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import FilterCard from './FilterCard'
import Job from './Job'
import { useSelector } from 'react-redux'
import Footer from './shared/Footer'

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job)
  const [filtered, setFiltered] = useState(allJobs)

  useEffect(() => {
    if (searchedQuery) {
      const q = searchedQuery.toLowerCase()
      const result = allJobs.filter(
        (j) =>
          j.title?.toLowerCase().includes(q) ||
          j.description?.toLowerCase().includes(q) ||
          j.location?.toLowerCase().includes(q) ||
          j.company?.name?.toLowerCase().includes(q)
      )
      setFiltered(result)
    } else {
      setFiltered(allJobs)
    }
  }, [allJobs, searchedQuery])

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 mt-6 mb-10">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-64 shrink-0">
            <FilterCard />
          </div>
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-400">No jobs found{searchedQuery ? ` for "${searchedQuery}"` : ''}.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Showing <span className="font-semibold text-gray-800">{filtered.length}</span> jobs
                  {searchedQuery && <> for <span className="font-semibold text-[#6A38C2]">"{searchedQuery}"</span></>}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filtered.map((job) => (
                    <Job key={job._id} job={job} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Jobs

import React from 'react'
import LatestJobCards from './LatestJobCards'
import { useSelector } from 'react-redux'

const LatestJobs = () => {
  const { allJobs } = useSelector((store) => store.job)

  return (
    <div className="max-w-7xl mx-auto my-10 px-4">
      <h2 className="text-3xl font-bold mb-8">
        <span className="text-[#6A38C2]">Latest &amp; Top</span> Job Openings
      </h2>
      {allJobs.length === 0 ? (
        <p className="text-gray-400 text-center py-10">No jobs available right now.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allJobs.slice(0, 6).map((job) => (
            <LatestJobCards key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

export default LatestJobs

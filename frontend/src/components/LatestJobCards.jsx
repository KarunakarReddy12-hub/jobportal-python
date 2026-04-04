import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/description/${job?._id}`)}
      className="p-5 rounded-xl shadow-md bg-white border border-gray-100 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          {job?.company?.logo ? (
            <img src={`http://localhost:8000${job.company.logo}`} alt={job?.company?.name} className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs font-bold text-gray-500">{job?.company?.name?.[0]}</span>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-sm">{job?.company?.name}</h2>
          <p className="text-xs text-gray-400">{job?.company?.location || 'India'}</p>
        </div>
      </div>
      <h3 className="font-bold text-base mb-2">{job?.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-3">{job?.description}</p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="ghost" className="text-blue-700 font-semibold">{job?.position} Positions</Badge>
        <Badge variant="ghost" className="text-[#F83002] font-semibold">{job?.jobType}</Badge>
        <Badge variant="ghost" className="text-[#7209b7] font-semibold">{job?.salary} LPA</Badge>
      </div>
    </div>
  )
}

export default LatestJobCards

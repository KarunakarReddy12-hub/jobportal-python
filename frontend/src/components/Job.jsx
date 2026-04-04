import React from 'react'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Job = ({ job }) => {
  const navigate = useNavigate()

  const daysAgo = (dateStr) => {
    const created = new Date(dateStr)
    const diff = Math.floor((Date.now() - created) / (1000 * 60 * 60 * 24))
    return diff === 0 ? 'Today' : `${diff}d ago`
  }

  return (
    <div className="p-5 rounded-xl shadow-md bg-white border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-400">{daysAgo(job?.createdAt)}</p>
        <Button variant="outline" size="icon" className="rounded-full h-8 w-8">
          <Bookmark size={14} />
        </Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="h-11 w-11 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border">
          {job?.company?.logo ? (
            <img src={`http://localhost:8000${job.company.logo}`} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-sm font-bold text-gray-500">{job?.company?.name?.[0]}</span>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-sm">{job?.company?.name}</h2>
          <p className="text-xs text-gray-400">{job?.company?.location || 'India'}</p>
        </div>
      </div>

      <h3 className="font-bold text-base mb-1">{job?.title}</h3>
      <p className="text-sm text-gray-500 line-clamp-2 mb-4">{job?.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <Badge variant="ghost" className="text-blue-700 font-semibold">{job?.position} Positions</Badge>
        <Badge variant="ghost" className="text-[#F83002] font-semibold">{job?.jobType}</Badge>
        <Badge variant="ghost" className="text-[#7209b7] font-semibold">{job?.salary} LPA</Badge>
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/description/${job?._id}`)}
          className="flex-1"
        >
          View Details
        </Button>
        <Button
          size="sm"
          className="flex-1 bg-[#7209b7] hover:bg-[#5f32ad]"
          onClick={() => navigate(`/description/${job?._id}`)}
        >
          Apply Now
        </Button>
      </div>
    </div>
  )
}

export default Job

import React, { useEffect, useState } from 'react'
import Navbar from './shared/Navbar'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom'
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant'
import { setSingleJob } from '@/redux/jobSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import api from '@/utils/axios'

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job)
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const { id: jobId } = useParams()

  // FIX: compare as strings — original compared mismatched types (_id could be number from Spring Boot)
  const [isApplied, setIsApplied] = useState(false)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`${JOB_API_END_POINT}/get/${jobId}`)
        if (res.data.success) {
          const job = res.data.data?.job
          dispatch(setSingleJob(job))
          // FIX: safe check — toString both sides
          const applied = job?.applications?.some(
            (app) => String(app.applicant) === String(user?.id)
          )
          setIsApplied(applied || false)
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchJob()
  }, [jobId, dispatch, user?.id])

  const applyJobHandler = async () => {
    try {
      const res = await api.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`)
      if (res.data.success) {
        setIsApplied(true)
        const updated = {
          ...singleJob,
          applications: [...(singleJob.applications || []), { applicant: user?.id }],
        }
        dispatch(setSingleJob(updated))
        toast.success(res.data.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to apply')
    }
  }

  if (!singleJob) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-400">Loading job details...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto my-10 px-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="font-bold text-2xl mb-3">{singleJob?.title}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {/* FIX: was "postion" (typo) in original */}
              <Badge className="text-blue-700 font-bold" variant="ghost">
                {singleJob?.position} Positions
              </Badge>
              <Badge className="text-[#F83002] font-bold" variant="ghost">
                {singleJob?.jobType}
              </Badge>
              <Badge className="text-[#7209b7] font-bold" variant="ghost">
                {singleJob?.salary} LPA
              </Badge>
            </div>
          </div>
          <Button
            onClick={isApplied ? undefined : applyJobHandler}
            disabled={isApplied}
            className={`rounded-lg ${isApplied ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
          >
            {isApplied ? 'Already Applied' : 'Apply Now'}
          </Button>
        </div>

        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <h2 className="border-b-2 border-gray-200 font-semibold text-lg pb-3 mb-4">Job Description</h2>
          <div className="space-y-3 text-sm">
            <p><span className="font-bold">Role:</span> <span className="text-gray-700 ml-2">{singleJob?.title}</span></p>
            <p><span className="font-bold">Location:</span> <span className="text-gray-700 ml-2">{singleJob?.location}</span></p>
            <p><span className="font-bold">Description:</span> <span className="text-gray-700 ml-2">{singleJob?.description}</span></p>
            <p><span className="font-bold">Experience:</span> <span className="text-gray-700 ml-2">{singleJob?.experienceLevel} years</span></p>
            <p><span className="font-bold">Salary:</span> <span className="text-gray-700 ml-2">{singleJob?.salary} LPA</span></p>
            {singleJob?.requirements?.length > 0 && (
              <div>
                <span className="font-bold">Requirements:</span>
                <ul className="list-disc ml-6 mt-1 text-gray-700">
                  {singleJob.requirements.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </div>
            )}
            <p><span className="font-bold">Total Applicants:</span> <span className="text-gray-700 ml-2">{singleJob?.applications?.length || 0}</span></p>
            <p>
              <span className="font-bold">Posted Date:</span>{' '}
              <span className="text-gray-700 ml-2">
                {singleJob?.createdAt ? new Date(singleJob.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JobDescription

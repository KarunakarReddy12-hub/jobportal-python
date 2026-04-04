import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { JOB_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'

const PostJob = () => {
  const navigate = useNavigate()
  const { companies } = useSelector((store) => store.company)
  const [loading, setLoading] = useState(false)

  const [input, setInput] = useState({
    title: '',
    description: '',
    requirements: '',
    salary: '',
    location: '',
    jobType: '',
    experience: '',
    position: 1,
    companyId: '',
  })

  const changeHandler = (e) =>
    setInput({ ...input, [e.target.name]: e.target.value })

  // FIX: selectChangeHandler now uses company._id directly (was finding by lowercased name — fragile)
  const selectChangeHandler = (value) => {
    setInput({ ...input, companyId: value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!input.title || !input.description || !input.requirements || !input.salary ||
        !input.location || !input.jobType || !input.experience || !input.companyId) {
      toast.error('All fields are required')
      return
    }
    try {
      setLoading(true)
      const res = await api.post(`${JOB_API_END_POINT}/post`, input, {
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/admin/jobs')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center w-full px-4 my-10">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-4xl border border-gray-200 shadow-lg rounded-xl p-8 bg-white"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-bold text-xl">Post a New Job</h1>
            <Link
              to="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
            >
              Back to Home
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Job Title</Label>
              <Input name="title" value={input.title} onChange={changeHandler} className="mt-1" placeholder="e.g. Frontend Developer" />
            </div>
            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeHandler} className="mt-1" placeholder="Short job description" />
            </div>
            <div>
              <Label>Requirements <span className="text-gray-400 text-xs">(comma-separated)</span></Label>
              <Input name="requirements" value={input.requirements} onChange={changeHandler} className="mt-1" placeholder="React, Node.js, SQL" />
            </div>
            <div>
              <Label>Salary (LPA)</Label>
              <Input type="number" step="0.1" name="salary" value={input.salary} onChange={changeHandler} className="mt-1" placeholder="e.g. 12" />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeHandler} className="mt-1" placeholder="e.g. Bangalore" />
            </div>
            <div>
              <Label>Job Type</Label>
              <Input name="jobType" value={input.jobType} onChange={changeHandler} className="mt-1" placeholder="Full-time / Part-time / Remote" />
            </div>
            <div>
              <Label>Experience (years)</Label>
              <Input type="number" min="0" name="experience" value={input.experience} onChange={changeHandler} className="mt-1" placeholder="e.g. 2" />
            </div>
            <div>
              <Label>No. of Positions</Label>
              <Input type="number" name="position" value={input.position} onChange={changeHandler} className="mt-1" min="1" />
            </div>

            {companies.length > 0 && (
              <div className="sm:col-span-2">
                <Label>Select Company</Label>
                {/* FIX: use company._id as value (was company.name.toLowerCase() — broke on name mismatch) */}
                <Select onValueChange={selectChangeHandler}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a company" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {companies.map((company) => (
                        // FIX: added key prop — was missing in original
                        <SelectItem key={company._id} value={String(company._id)}>
                          {company.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div className="mt-6">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                Post Job
              </Button>
            )}
          </div>

          {companies.length === 0 && (
            <p className="text-xs text-red-600 font-semibold text-center mt-4">
              * Please register a company first before posting a job.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}

export default PostJob

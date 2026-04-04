import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useNavigate } from 'react-router-dom'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import AdminJobsTable from './AdminJobsTable'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'

const AdminJobs = () => {
  useGetAllAdminJobs()
  useGetAllCompanies()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 my-8">
        <div className="flex items-center justify-between mb-6 gap-2">
          <h1 className="font-bold text-xl">Posted Jobs</h1>
          <div className="flex gap-2">
            <Button
              className="bg-gray-500 hover:bg-gray-600"
              onClick={() => navigate('/')}
            >
              Home
            </Button>
            <Button
              className="bg-[#6A38C2] hover:bg-[#5b30a6]"
              onClick={() => navigate('/admin/jobs/create')}
            >
              + Post New Job
            </Button>
          </div>
        </div>
        <Input
          placeholder="Filter by title, company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs mb-5"
        />
        <AdminJobsTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default AdminJobs

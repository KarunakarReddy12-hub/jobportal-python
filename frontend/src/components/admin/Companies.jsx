import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { useNavigate } from 'react-router-dom'
import useGetAllCompanies from '@/hooks/useGetAllCompanies'
import CompaniesTable from './CompaniesTable'

const Companies = () => {
  useGetAllCompanies()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 my-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-bold text-xl">Your Companies</h1>
          <Button
            className="bg-[#6A38C2] hover:bg-[#5b30a6]"
            onClick={() => navigate('/admin/companies/create')}
          >
            + New Company
          </Button>
        </div>
        <Input
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs mb-5"
        />
        <CompaniesTable searchTerm={searchTerm} />
      </div>
    </div>
  )
}

export default Companies

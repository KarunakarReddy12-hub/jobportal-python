import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux'
import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'

const CompanyCreate = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)

  const registerCompany = async () => {
    if (!companyName.trim()) {
      toast.error('Company name is required')
      return
    }
    try {
      setLoading(true)
      const res = await api.post(`${COMPANY_API_END_POINT}/register`, { companyName })
      if (res.data.success) {
        dispatch(setSingleCompany(res.data.data?.company || {}))
        toast.success(res.data.message)
        const companyId = res.data.data?.company?._id
        navigate(`/admin/companies/${companyId}`)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to register company')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 my-10">
        <div className="mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-gray-500 mb-4"
            onClick={() => navigate('/admin/companies')}
          >
            <ArrowLeft size={16} /> Back
          </Button>
          <h1 className="font-bold text-2xl">Your Company Name</h1>
          <p className="text-gray-500 mt-1">
            What would you like to name your company? You can change this later.
          </p>
        </div>

        <div className="space-y-4 max-w-sm">
          <div>
            <Label>Company Name</Label>
            <Input
              type="text"
              className="mt-1"
              placeholder="JobHunt, Microsoft, etc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && registerCompany()}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => navigate('/admin/companies')}>
              Cancel
            </Button>
            {loading ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </Button>
            ) : (
              <Button
                className="bg-[#6A38C2] hover:bg-[#5b30a6]"
                onClick={registerCompany}
              >
                Continue
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CompanyCreate

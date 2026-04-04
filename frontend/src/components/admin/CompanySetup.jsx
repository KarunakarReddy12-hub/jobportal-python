import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
import useGetCompanyById from '@/hooks/useGetCompanyById'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'

const CompanySetup = () => {
  const { id } = useParams()
  useGetCompanyById(id)

  const { singleCompany } = useSelector((store) => store.company)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [input, setInput] = useState({
    name: '',
    description: '',
    website: '',
    location: '',
    file: null,
  })

  // Pre-fill when company loads
  useEffect(() => {
    if (singleCompany && singleCompany.name) {
      setInput({
        name: singleCompany.name || '',
        description: singleCompany.description || '',
        website: singleCompany.website || '',
        location: singleCompany.location || '',
        file: null,
      })
    }
  }, [singleCompany])

  const changeHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
  const fileHandler = (e) => setInput({ ...input, file: e.target.files?.[0] || null })

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (input.name)        formData.append('name', input.name)
    if (input.description) formData.append('description', input.description)
    if (input.website)     formData.append('website', input.website)
    if (input.location)    formData.append('location', input.location)
    // FIX: only append file if actually chosen — original crashed without it
    if (input.file)        formData.append('file', input.file)

    try {
      setLoading(true)
      const res = await api.put(`${COMPANY_API_END_POINT}/update/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        toast.success(res.data.message)
        navigate('/admin/companies')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-xl mx-auto px-4 my-10">
        <form onSubmit={submitHandler}>
          <div className="flex items-center gap-4 mb-8">
            <Button
              type="button"
              onClick={() => navigate('/admin/companies')}
              variant="outline"
              className="flex items-center gap-2 text-gray-500"
            >
              <ArrowLeft size={16} /> Back
            </Button>
            <h1 className="font-bold text-xl">Company Setup</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input name="name" value={input.name} onChange={changeHandler} className="mt-1" />
            </div>
            <div>
              <Label>Description</Label>
              <Input name="description" value={input.description} onChange={changeHandler} className="mt-1" />
            </div>
            <div>
              <Label>Website</Label>
              <Input name="website" value={input.website} onChange={changeHandler} placeholder="https://..." className="mt-1" />
            </div>
            <div>
              <Label>Location</Label>
              <Input name="location" value={input.location} onChange={changeHandler} placeholder="City, Country" className="mt-1" />
            </div>
            <div className="sm:col-span-2">
              <Label>Company Logo</Label>
              <Input type="file" accept="image/*" onChange={fileHandler} className="mt-1" />
            </div>
          </div>

          <div className="mt-6">
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                Save Changes
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default CompanySetup

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/authSlice'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import api from '@/utils/axios'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    file: null,
  })

  const changeHandler = (e) => setInput({ ...input, [e.target.name]: e.target.value })
  const fileHandler = (e) => setInput({ ...input, file: e.target.files?.[0] || null })

  const submitHandler = async (e) => {
    e.preventDefault()
    const formData = new FormData()
    if (input.fullname)    formData.append('fullname', input.fullname)
    if (input.email)       formData.append('email', input.email)
    if (input.phoneNumber) formData.append('phoneNumber', input.phoneNumber)
    if (input.bio)         formData.append('bio', input.bio)
    if (input.skills)      formData.append('skills', input.skills)
    if (input.file)        formData.append('file', input.file)  // FIX: only append if provided

    try {
      setLoading(true)
      const res = await api.post(`${USER_API_END_POINT}/profile/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (res.data.success) {
        dispatch(setUser(res.data.data))
        toast.success(res.data.message)
        setOpen(false)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={submitHandler} className="space-y-3">
          <div>
            <Label>Full Name</Label>
            <Input name="fullname" value={input.fullname} onChange={changeHandler} />
          </div>
          <div>
            <Label>Email</Label>
            <Input name="email" type="email" value={input.email} onChange={changeHandler} />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input name="phoneNumber" value={input.phoneNumber} onChange={changeHandler} />
          </div>
          <div>
            <Label>Bio</Label>
            <Input name="bio" value={input.bio} onChange={changeHandler} placeholder="A short bio..." />
          </div>
          <div>
            <Label>Skills (comma-separated)</Label>
            <Input name="skills" value={input.skills} onChange={changeHandler} placeholder="React, Node.js, Java" />
          </div>
          <div>
            <Label>Resume (PDF)</Label>
            <Input type="file" accept=".pdf,.doc,.docx" onChange={fileHandler} />
          </div>
          <DialogFooter>
            {loading ? (
              <Button disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-[#6A38C2] hover:bg-[#5b30a6]">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog

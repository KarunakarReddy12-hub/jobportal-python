import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen, FileText } from 'lucide-react'
import { Badge } from './ui/badge'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs'

const Profile = () => {
  useGetAppliedJobs()
  const [open, setOpen] = useState(false)
  const { user } = useSelector((store) => store.auth)

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-5">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={
                    user?.profilePhoto
                      ? `http://localhost:8000${user.profilePhoto}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullname || 'U')}&size=80`
                  }
                  alt={user?.fullname}
                />
              </Avatar>
              <div>
                <h1 className="font-bold text-xl">{user?.fullname}</h1>
                <p className="text-gray-500 text-sm mt-1">{user?.bio || 'No bio added yet'}</p>
              </div>
            </div>
            <Button onClick={() => setOpen(true)} variant="outline" size="icon">
              <Pen size={16} />
            </Button>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Contact size={16} className="text-gray-400" />
              <span>{user?.phoneNumber}</span>
            </div>
          </div>

          {/* Skills - FIX: guard against undefined/null skills array */}
          <div className="mt-6">
            <h2 className="font-semibold text-sm mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user?.skills?.length > 0
                ? user.skills.map((skill, i) => (
                    <Badge key={i} variant="secondary">{skill}</Badge>
                  ))
                : <span className="text-sm text-gray-400">No skills added</span>
              }
            </div>
          </div>

          {/* Resume */}
          <div className="mt-6">
            <Label className="font-semibold text-sm">Resume</Label>
            {user?.resume ? (
              <div className="flex items-center gap-2 mt-1">
                <FileText size={16} className="text-[#6A38C2]" />
                <a
                  href={`http://localhost:8000${user.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 text-sm hover:underline"
                >
                  {user?.resumeOriginalName || 'View Resume'}
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400 mt-1">No resume uploaded</p>
            )}
          </div>
        </div>

        {/* Applied Jobs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-4">Applied Jobs</h2>
          <AppliedJobTable />
        </div>
      </div>

      <UpdateProfileDialog open={open} setOpen={setOpen} />
    </div>
  )
}

export default Profile

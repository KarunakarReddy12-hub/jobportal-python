import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { MoreHorizontal, CheckCircle, XCircle } from 'lucide-react'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import api from '@/utils/axios'

const statusColor = {
  pending: 'text-yellow-600',
  accepted: 'text-green-600',
  rejected: 'text-red-600',
}

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application)
  const applications = applicants?.applications || []

  const updateStatus = async (status, applicationId) => {
    try {
      const res = await api.post(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status })
      if (res.data.success) {
        toast.success(res.data.message)
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Status update failed')
    }
  }

  return (
    <Table>
      <TableCaption>
        {applications.length === 0 ? 'No applicants yet.' : 'All applicants for this job'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Resume</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Applied On</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {applications.map((app) => (
          <TableRow key={app._id}>
            <TableCell className="font-medium">{app?.applicant?.fullname}</TableCell>
            <TableCell>{app?.applicant?.email}</TableCell>
            <TableCell>{app?.applicant?.phoneNumber}</TableCell>
            <TableCell>
              {app?.applicant?.resume ? (
                <a
                  href={`http://localhost:8000${app.applicant.resume}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  {app?.applicant?.resumeOriginalName || 'View'}
                </a>
              ) : (
                <span className="text-gray-400 text-sm">NA</span>
              )}
            </TableCell>
            <TableCell>
              <span className={`text-sm font-semibold capitalize ${statusColor[app?.status] || 'text-gray-600'}`}>
                {app?.status}
              </span>
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-1">
                  {['accepted', 'rejected'].map((s) => (
                    <Button
                      key={s}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start gap-2 capitalize"
                      onClick={() => updateStatus(s, app._id)}
                    >
                      {s === 'accepted'
                        ? <CheckCircle size={14} className="text-green-600" />
                        : <XCircle size={14} className="text-red-600" />}
                      {s}
                    </Button>
                  ))}
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default ApplicantsTable

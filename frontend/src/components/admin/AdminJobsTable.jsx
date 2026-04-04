import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Button } from '../ui/button'
import { Eye, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

const AdminJobsTable = ({ searchTerm }) => {
  const { allAdminJobs } = useSelector((store) => store.job)
  const navigate = useNavigate()

  const filtered = allAdminJobs.filter((job) => {
    const q = (searchTerm || '').toLowerCase()
    return (
      job.title?.toLowerCase().includes(q) ||
      job.company?.name?.toLowerCase().includes(q)
    )
  })

  return (
    <Table>
      <TableCaption>
        {filtered.length === 0 ? 'No jobs posted yet.' : 'Your posted jobs'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Date Posted</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((job) => (
          <TableRow key={job._id}>
            <TableCell className="font-medium">{job?.company?.name}</TableCell>
            <TableCell>{job?.title}</TableCell>
            <TableCell>
              {job?.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell className="text-right">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start gap-2"
                    onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)}
                  >
                    <Eye size={14} /> View Applicants
                  </Button>
                </PopoverContent>
              </Popover>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AdminJobsTable

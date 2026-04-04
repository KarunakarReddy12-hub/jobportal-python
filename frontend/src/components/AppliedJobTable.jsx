import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const statusColor = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector((store) => store.job)

  return (
    <Table>
      <TableCaption>
        {allAppliedJobs.length === 0 ? "You haven't applied to any jobs yet." : 'Your applied jobs'}
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Job Role</TableHead>
          <TableHead>Company</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allAppliedJobs.map((app) => (
          <TableRow key={app._id}>
            <TableCell className="text-sm text-gray-500">
              {app?.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'N/A'}
            </TableCell>
            <TableCell className="font-medium">{app?.job?.title}</TableCell>
            <TableCell>{app?.job?.company?.name}</TableCell>
            <TableCell className="text-right">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor[app?.status] || 'bg-gray-100 text-gray-600'}`}>
                {app?.status?.charAt(0).toUpperCase() + app?.status?.slice(1)}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default AppliedJobTable

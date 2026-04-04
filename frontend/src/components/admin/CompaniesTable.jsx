import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Edit2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CompaniesTable = ({ searchTerm }) => {
  const { companies } = useSelector((store) => store.company)
  const navigate = useNavigate()

  const filtered = companies.filter((c) =>
    c.name?.toLowerCase().includes((searchTerm || '').toLowerCase())
  )

  return (
    <Table>
      <TableCaption>{filtered.length === 0 ? 'No companies registered yet.' : 'Your registered companies'}</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Logo</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>Registered On</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((company) => (
          <TableRow key={company._id}>
            <TableCell>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={company.logo ? `http://localhost:8000${company.logo}` : undefined}
                  alt={company.name}
                />
              </Avatar>
            </TableCell>
            <TableCell className="font-medium">{company.name}</TableCell>
            <TableCell>{company.location || 'N/A'}</TableCell>
            <TableCell>{company.createdAt ? new Date(company.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
            <TableCell className="text-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/admin/companies/${company._id}`)}
              >
                <Edit2 size={14} className="mr-1" /> Edit
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CompaniesTable

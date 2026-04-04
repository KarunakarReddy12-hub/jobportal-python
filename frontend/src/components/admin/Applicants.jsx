import React, { useEffect } from 'react'
import Navbar from '../shared/Navbar'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setAllApplicants } from '@/redux/applicationSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import ApplicantsTable from './ApplicantsTable'
import api from '@/utils/axios'

const Applicants = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { applicants } = useSelector((store) => store.application)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`${APPLICATION_API_END_POINT}/${id}/applicants`)
        if (res.data.success) {
          dispatch(setAllApplicants(res.data.data?.job || null))
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetch()
  }, [id, dispatch])

  return (
    <div>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 my-8">
        <h1 className="font-bold text-xl mb-6">
          Applicants{applicants?.title ? ` — ${applicants.title}` : ''}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({applicants?.applications?.length || 0} total)
          </span>
        </h1>
        <ApplicantsTable />
      </div>
    </div>
  )
}

export default Applicants

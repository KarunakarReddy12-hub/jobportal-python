import { setAllAdminJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import api from '@/utils/axios'

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`${JOB_API_END_POINT}/getadminjobs`)
        if (res.data.success) {
          dispatch(setAllAdminJobs(res.data.data?.jobs || []))
        }
      } catch (e) {
        console.error('Failed to fetch admin jobs:', e)
      }
    }
    fetch()
  }, [dispatch])
}

export default useGetAllAdminJobs

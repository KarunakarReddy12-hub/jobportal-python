import { setAllAppliedJobs } from '@/redux/jobSlice'
import { APPLICATION_API_END_POINT } from '@/utils/constant'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import api from '@/utils/axios'

const useGetAppliedJobs = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`${APPLICATION_API_END_POINT}/get`)
        if (res.data.success) {
          dispatch(setAllAppliedJobs(res.data.data?.application || []))
        }
      } catch (e) {
        console.error('Failed to fetch applied jobs:', e)
      }
    }
    fetch()
  }, [dispatch])
}

export default useGetAppliedJobs

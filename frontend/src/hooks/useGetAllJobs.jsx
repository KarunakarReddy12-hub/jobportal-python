import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '@/utils/axios'

const useGetAllJobs = () => {
  const dispatch = useDispatch()
  // FIX: include searchedQuery in dependency array so it refetches on search
  const { searchedQuery } = useSelector((store) => store.job)

  useEffect(() => {
    const fetchAllJobs = async () => {
      try {
        const res = await api.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery || ''}`)
        if (res.data.success) {
          dispatch(setAllJobs(res.data.data?.jobs || []))
        }
      } catch (error) {
        console.error('Failed to fetch jobs:', error)
      }
    }
    fetchAllJobs()
  }, [searchedQuery, dispatch]) // FIX: was [] — never re-fetched on query change
}

export default useGetAllJobs

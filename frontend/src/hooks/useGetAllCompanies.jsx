import { setCompanies } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import api from '@/utils/axios'

const useGetAllCompanies = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`${COMPANY_API_END_POINT}/get`)
        if (res.data.success) {
          dispatch(setCompanies(res.data.data?.companies || []))
        }
      } catch (e) {
        console.error('Failed to fetch companies:', e)
      }
    }
    fetch()
  }, [dispatch])
}

export default useGetAllCompanies

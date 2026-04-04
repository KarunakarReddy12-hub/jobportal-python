import { setSingleCompany } from '@/redux/companySlice'
import { COMPANY_API_END_POINT } from '@/utils/constant'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import api from '@/utils/axios'

const useGetCompanyById = (id) => {
  const dispatch = useDispatch()
  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        const res = await api.get(`${COMPANY_API_END_POINT}/get/${id}`)
        if (res.data.success) {
          dispatch(setSingleCompany(res.data.data?.company || {}))
        }
      } catch (e) {
        console.error('Failed to fetch company:', e)
      }
    }
    fetch()
  }, [id, dispatch])
}

export default useGetCompanyById

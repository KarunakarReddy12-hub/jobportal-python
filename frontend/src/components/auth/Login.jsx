import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading, setUser, setToken } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'
import api from '@/utils/axios'

const Login = () => {
  const [input, setInput] = useState({ email: '', password: '', role: 'student' })
  const { loading, user } = useSelector((store) => store.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // FIX: redirect if already logged in (was missing user in deps)
  useEffect(() => {
    if (user) navigate('/')
  }, [user, navigate])

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    if (!input.email || !input.password || !input.role) {
      toast.error('All fields are required')
      return
    }
    try {
      dispatch(setLoading(true))
      const res = await api.post(`${USER_API_END_POINT}/login`, input)
      if (res.data.success) {
        // FIX: store token in redux so axios interceptor uses it
        dispatch(setToken(res.data.token))
        dispatch(setUser(res.data.user))
        navigate('/')
        toast.success(res.data.message)
      }
    } catch (error) {
      // FIX: safe error access — original crashed if response was undefined
      const msg = error?.response?.data?.message || 'Login failed. Please try again.'
      toast.error(msg)
    } finally {
      dispatch(setLoading(false))
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center max-w-7xl mx-auto">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-md border border-gray-200 rounded-md p-6 my-10 shadow-sm"
        >
          <h1 className="font-bold text-xl mb-5">Login</h1>

          <div className="my-2">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="you@example.com"
            />
          </div>

          <div className="my-2">
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={input.password}
              onChange={changeEventHandler}
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <RadioGroup className="flex items-center gap-4 my-5">
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="student"
                  checked={input.role === 'student'}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4"
                />
                <Label>Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === 'recruiter'}
                  onChange={changeEventHandler}
                  className="cursor-pointer w-4 h-4"
                />
                <Label>Recruiter</Label>
              </div>
            </RadioGroup>
          </div>

          {loading ? (
            <Button className="w-full my-4" disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
            </Button>
          ) : (
            <Button type="submit" className="w-full my-4">
              Login
            </Button>
          )}

          <span className="text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </span>
        </form>
      </div>
    </div>
  )
}

export default Login

import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { USER_API_END_POINT } from '@/utils/constant'
import { logout } from '@/redux/authSlice'
import { toast } from 'sonner'
import api from '@/utils/axios'

const Navbar = () => {
  const { user } = useSelector((store) => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // FIX: call backend logout, then clear both user AND token from redux
  const logoutHandler = async () => {
    try {
      await api.get(`${USER_API_END_POINT}/logout`)
    } catch (_) {
      // Even if backend call fails, clear client state
    }
    dispatch(logout())          // clears user + token
    navigate('/')
    toast.success('Logged out successfully.')
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold">
            Job<span className="text-[#F83002]">Portal</span>
          </h1>
        </Link>

        {/* Nav links + auth */}
        <div className="flex items-center gap-10">
          <ul className="flex font-medium items-center gap-6">
            {user && user.role === 'recruiter' ? (
              <>
                <li><Link to="/" className="hover:text-[#6A38C2]">Home</Link></li>
                <li><Link to="/admin/companies" className="hover:text-[#6A38C2]">Companies</Link></li>
                <li><Link to="/admin/jobs" className="hover:text-[#6A38C2]">Jobs</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/" className="hover:text-[#6A38C2]">Home</Link></li>
                <li><Link to="/jobs" className="hover:text-[#6A38C2]">Jobs</Link></li>
                <li><Link to="/browse" className="hover:text-[#6A38C2]">Browse</Link></li>
              </>
            )}
          </ul>

          {!user ? (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6]">Sign Up</Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer h-9 w-9">
                  <AvatarImage
                    src={user?.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.fullname || 'U')}
                    alt={user?.fullname}
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="flex gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={user?.profilePhoto || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user?.fullname || 'U')}
                      alt={user?.fullname}
                    />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{user?.fullname}</h4>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    {user?.bio && <p className="text-xs text-muted-foreground mt-1">{user?.bio}</p>}
                  </div>
                </div>
                <hr className="my-2" />
                <div className="flex flex-col gap-1 text-gray-600">
                  {user?.role === 'student' && (
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1">
                      <User2 size={16} />
                      <Link to="/profile" className="text-sm">View Profile</Link>
                    </div>
                  )}
                  {/* FIX: Signout button — was missing from original, now fully working */}
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-2 py-1 text-red-600"
                    onClick={logoutHandler}
                  >
                    <LogOut size={16} />
                    <span className="text-sm font-medium">Sign Out</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar

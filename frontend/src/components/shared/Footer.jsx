import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-10">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-3">Job<span className="text-[#F83002]">Portal</span></h2>
            <p className="text-gray-400 text-sm">Your gateway to the best opportunities. Connect talent with the right companies.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/jobs" className="hover:text-white">Browse Jobs</a></li>
              <li><a href="/signup" className="hover:text-white">Create Account</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3">Contact</h3>
            <p className="text-gray-400 text-sm">support@jobportal.com</p>
          </div>
        </div>
        <hr className="border-gray-700 mt-8 mb-4" />
        <p className="text-center text-gray-500 text-sm">© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer

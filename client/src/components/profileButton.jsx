import React, {useState} from 'react'
import { User, Link, LogOut } from 'lucide-react'


const profileButton = () => {
    const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className="relative">
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center space-x-2 text-white hover:text-green-500 transition-colors"
    >
      <User className="h-6 w-6" />
    </button>

    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-md shadow-lg py-1 border border-green-500/20">
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-black hover:text-green-500"
        >
          <Link className="h-4 w-4 mr-2" />
          Your Short URLs
        </a>
        <a
          href="#"
          className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-black hover:text-green-500"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </a>
      </div>
    )}
  </div>
  )
}

export default profileButton

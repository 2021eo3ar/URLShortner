import React from 'react'
import { Link2 } from 'lucide-react'
import ProfileButton from './profileButton'

const HomeNavbar = () => {
  return (
    <nav className="bg-black border-b border-green-500/20 px-4 py-3">
    <div className="max-w-7xl mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Link2 className="h-6 w-6 text-green-500" />
        <span className="text-green-500 font-bold text-xl">Shortify</span>
      </div>
      <ProfileButton />
    </div>
  </nav>
  )
}

export default HomeNavbar

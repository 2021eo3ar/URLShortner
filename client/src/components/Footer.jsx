import React from 'react'
import { Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-black text-white pt-16 pb-8 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Contact Us</h3>
          <form className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            <textarea
              placeholder="Message"
              rows={4}
              className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            ></textarea>
            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2 rounded-md transition-colors w-full">
              Send Message
            </button>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-green-500">About Us</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Features</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Pricing</a></li>
              <li><a href="#" className="text-gray-400 hover:text-green-500">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-2 text-gray-400">
                <Mail className="h-4 w-4 text-green-500" />
                info@shortify.com
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <Phone className="h-4 w-4 text-green-500" />
                +1 (555) 123-4567
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <MapPin className="h-4 w-4 text-green-500" />
                123 Web Street, Internet City
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Shortify. All rights reserved.</p>
      </div>
    </div>
  </footer>
  )
}

export default Footer

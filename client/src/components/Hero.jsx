import React from 'react'
import { Link,ArrowRight } from 'lucide-react'

const Hero = () => {
  return (
    <div className="bg-black text-white py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold">
            Make your links
            <span className="text-green-500"> shorter</span> and
            <span className="text-green-500"> smarter</span>
          </h1>
          <p className="text-gray-400 text-lg">
            Transform your long URLs into concise, memorable links. Track clicks, analyze data,
            and optimize your online presence with Shortify.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              placeholder="Paste your long URL here..."
              className="flex-1 px-4 py-3 rounded-md bg-gray-900 border border-gray-800 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            />
            <button className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-md transition-colors flex items-center justify-center gap-2">
              Shorten URL
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <Link className="h-48 w-48 text-green-500 opacity-20" />
        </div>
      </div>
    </div>
  </div>
  )
}

export default Hero

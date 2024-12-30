import React from 'react'
import { Zap, Shield, BarChart3 } from 'lucide-react'

const Features = () => {
    const features = [
        {
          icon: <Zap className="h-8 w-8 text-green-500" />,
          title: 'Lightning Fast',
          description: 'Generate short URLs instantly with our optimized system'
        },
        {
          icon: <Shield className="h-8 w-8 text-green-500" />,
          title: 'Secure Links',
          description: 'All shortened URLs are protected and monitored for safety'
        },
        {
          icon: <BarChart3 className="h-8 w-8 text-green-500" />,
          title: 'Analytics',
          description: 'Track clicks and analyze your link performance'
        }
      ];
  return (
    <div className="bg-gray-900 py-16 px-4">
    <div className="max-w-7xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div key={index} className="bg-black p-6 rounded-lg border border-green-500/20">
            {feature.icon}
            <h3 className="text-white font-semibold text-xl mt-4">{feature.title}</h3>
            <p className="text-gray-400 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  )
}

export default Features

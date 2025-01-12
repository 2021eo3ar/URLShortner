import React from 'react';

export default function Loader() {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-16 h-16 border-4 border-green-500/20 rounded-full animate-spin">
          {/* Inner ring */}
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-green-500 rounded-full animate-spin-fast border-t-transparent"></div>
        </div>
        {/* Loading text */}
        <div className="mt-4 text-center text-green-500 font-medium">Loading...</div>
      </div>
    </div>
  );
}
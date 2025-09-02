import React from 'react'

export default function StyleSwitchButton({ onClick, isSatellite }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/95 backdrop-blur-sm hover:bg-white shadow-lg rounded-xl p-3 transition-all duration-200 border border-gray-200 hover:scale-105"
      title={`Switch to ${isSatellite ? 'Default Map' : 'Satellite'} view`}
    >
      <div className="flex items-center space-x-2">
        <span className="text-lg">
          {isSatellite ? '🗺️' : '🛰️'}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {isSatellite ? 'Map View' : 'Satellite'}
        </span>
      </div>
    </button>
  )
}
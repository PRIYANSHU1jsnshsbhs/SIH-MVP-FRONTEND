import React from 'react'
import { Plus, Minus, Compass, LocateFixed, RotateCcw } from 'lucide-react'

export default function MapNavigationControls({ 
  onZoomIn, 
  onZoomOut, 
  onResetBearing, 
  onFindLocation, 
  onResetView,
  sidebarExpanded 
}) {
  return (
  <div className="fixed top-6 right-6 md:right-72 z-30 transition-all duration-700">
      <div className="flex gap-2">
        {/* Zoom Controls */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden flex">
          <button
            onClick={onZoomIn}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-200"
            title="Zoom In"
          >
            <Plus size={18} className="text-gray-700" />
          </button>
          <button
            onClick={onZoomOut}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <Minus size={18} className="text-gray-700" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg border border-gray-200 overflow-hidden flex">
          <button
            onClick={onResetBearing}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-200"
            title="Reset Compass"
          >
            <Compass size={18} className="text-gray-700" />
          </button>
          <button
            onClick={onFindLocation}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors border-r border-gray-200"
            title="Find My Location"
          >
            <LocateFixed size={18} className="text-gray-700" />
          </button>
          <button
            onClick={onResetView}
            className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
            title="Reset View"
          >
            <RotateCcw size={18} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  )
}

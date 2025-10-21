/**
 * Debug component to check view mode state
 */

import React from 'react'

interface DebugViewModeProps {
  viewMode: 'cards' | 'list' | 'table'
}

export default function DebugViewMode({ viewMode }: DebugViewModeProps) {
  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 rounded p-2 z-50">
      <p className="text-sm font-semibold text-red-800">Debug View Mode</p>
      <p className="text-sm text-red-700">Current: {viewMode}</p>
      <p className="text-xs text-red-600">Should show Table button in normal view</p>
    </div>
  )
}

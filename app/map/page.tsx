"use client"

import dynamic from 'next/dynamic'
import { Loader2 } from "lucide-react"

// Loading component
function LoadingMap() {
  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="flex items-center gap-2">
        <Loader2 className="h-6 w-6 animate-spin" />
        <div className="text-lg">Loading map...</div>
      </div>
    </div>
  )
}

// Dynamically import the map component with no SSR
const AQIMap = dynamic(
  () => import('@/components/aqi-map'),
  { 
    ssr: false,
    loading: () => <LoadingMap />
  }
)

export default function MapPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="sr-only">VayuSathi Map</h1>
      <AQIMap />
    </div>
  )
}


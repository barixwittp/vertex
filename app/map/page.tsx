"use client"

import dynamic from 'next/dynamic'
import { Loader2 } from "lucide-react"

// Loading component
function LoadingMap() {
  return (
    <div className="fixed inset-0 pt-16 flex justify-center items-center">
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
  return <AQIMap />
}


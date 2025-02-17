"use client"

import { createContext, useContext, useEffect, useState } from "react"

interface Location {
  latitude: number
  longitude: number
  country?: string
  city?: string
}

interface LocationContextType {
  location: Location | null
  loading: boolean
  error: string | null
}

export const LocationContext = createContext<LocationContextType | null>(null)

const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function initializeLocation() {
      try {
        // Try to get cached location first
        const cachedLocation = sessionStorage.getItem('userLocation')
        if (cachedLocation) {
          setLocation(JSON.parse(cachedLocation))
          setLoading(false)
          return
        }

        // If no cached location, request new location
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser')
        }

        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject)
        })

        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        }

        // Get location details
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${newLocation.latitude}&lon=${newLocation.longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`
        )
        const data = await response.json()

        const locationWithDetails = {
          ...newLocation,
          country: data[0]?.country || 'Unknown',
          city: data[0]?.name || 'Unknown'
        }

        setLocation(locationWithDetails)
        sessionStorage.setItem('userLocation', JSON.stringify(locationWithDetails))

      } catch (err) {
        console.error('Error getting location:', err)
        setError(err instanceof Error ? err.message : 'Failed to get location')
        // Set default location (e.g., New York City)
        const defaultLocation = {
          latitude: 40.7128,
          longitude: -74.0060,
          city: 'New York City',
          country: 'USA'
        }
        setLocation(defaultLocation)
      } finally {
        setLoading(false)
      }
    }

    initializeLocation()
  }, [])

  return (
    <LocationContext.Provider value={{ location, loading, error }}>
      {children}
    </LocationContext.Provider>
  )
}

export function useLocation() {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}


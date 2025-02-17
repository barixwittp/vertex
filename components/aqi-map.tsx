"use client"

import { useEffect, useRef, useState } from 'react'
import { useLocation } from '@/components/location-provider'
import { AQIService, AQIData } from '@/lib/api/aqi-service'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Layers, Info, Crosshair, Search, Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import 'leaflet/dist/leaflet.css'

let L: any

if (typeof window !== 'undefined') {
  L = require('leaflet')
}

function getAQIColor(aqi: number): string {
  if (aqi <= 50) return '#00e400'
  if (aqi <= 100) return '#ffff00'
  if (aqi <= 150) return '#ff7e00'
  if (aqi <= 200) return '#ff0000'
  if (aqi <= 300) return '#99004c'
  return '#7e0023'
}

// Create custom marker icon
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background-color: ${color};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  })
}

export function AQIMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { location } = useLocation()
  const [map, setMap] = useState<any>(null)
  const [clickedLocation, setClickedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  // Function to handle location search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !map) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        map.flyTo([lat, lon], 12)
        
        // Simulate a click at this location
        const clickEvent = { latlng: { lat, lng: lon } }
        map.fire('click', clickEvent)
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search term",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Search failed",
        description: "Error searching for location",
        variant: "destructive"
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Function to go to current location
  const goToCurrentLocation = () => {
    if (!map || !location) return
    map.flyTo([location.latitude, location.longitude], 12)
  }

  useEffect(() => {
    if (!location || !mapContainerRef.current || map) return

    // Initialize map
    const leafletMap = L.map(mapContainerRef.current, {
      center: [location.latitude, location.longitude],
      zoom: 12,
      zoomControl: false,
      attributionControl: false
    })

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap)

    // Add zoom control
    L.control.zoom({
      position: 'bottomright'
    }).addTo(leafletMap)

    // Add current location marker
    const locationIcon = createCustomIcon('#3b82f6')
    const marker = L.marker([location.latitude, location.longitude], {
      icon: locationIcon,
      zIndexOffset: 1000
    })
      .addTo(leafletMap)
      .bindPopup('Your Location')
      .openPopup()

    // Handle map clicks
    leafletMap.on('click', async (e: any) => {
      const { lat, lng } = e.latlng
      
      try {
        // Remove previous clicked marker if exists
        if (clickedLocation) {
          leafletMap.removeLayer(clickedLocation)
        }

        // Add new marker at clicked location
        const clickIcon = createCustomIcon('#ef4444')
        const clickedMarker = L.marker([lat, lng], {
          icon: clickIcon,
          className: 'clicked-location'
        }).addTo(leafletMap)

        // Fetch AQI data for clicked location
        const data = await AQIService.getNearestStation(lat, lng)
        if (data) {
          const color = getAQIColor(data.aqi)
          
          // Add AQI circle
          L.circle([lat, lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            radius: 2000
          }).addTo(leafletMap)

          // Update marker popup with AQI info
          clickedMarker.bindPopup(`
            <div class="p-3">
              <h3 class="font-bold mb-1">Selected Location</h3>
              <p class="text-sm mb-1">AQI: ${data.aqi}</p>
              <p class="text-xs text-muted-foreground">
                Station: ${data.station || 'Nearest monitoring station'}
              </p>
            </div>
          `).openPopup()
        }

        setClickedLocation(clickedMarker)
      } catch (error) {
        console.error('Error fetching AQI data for clicked location:', error)
      }
    })

    setMap(leafletMap)
    setIsLoading(false)

    // Fetch AQI data for current location
    AQIService.getNearestStation(location.latitude, location.longitude)
      .then(data => {
        if (data) {
          const aqi = data.aqi
          const color = getAQIColor(aqi)
          
          L.circle([location.latitude, location.longitude], {
            color: color,
            fillColor: color,
            fillOpacity: 0.2,
            radius: 2000
          }).addTo(leafletMap)

          marker.bindPopup(`
            <div class="p-3">
              <h3 class="font-bold mb-1">Current Location</h3>
              <p class="text-sm mb-1">AQI: ${aqi}</p>
              <p class="text-xs text-muted-foreground">
                Station: ${data.station || 'Nearest monitoring station'}
              </p>
            </div>
          `).openPopup()
        }
      })
      .catch(error => {
        console.error('Error fetching AQI data:', error)
      })

    return () => {
      leafletMap.remove()
    }
  }, [location])

  if (!location) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-lg">Getting your location...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isSearching}>
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <div className="relative w-full h-[calc(100vh-12rem)] rounded-lg overflow-hidden shadow-lg">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full z-0" 
          style={{ 
            position: 'relative',
            backgroundColor: 'rgba(0,0,0,0.05)'
          }} 
        />
        
        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[400]">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm shadow-md"
            onClick={goToCurrentLocation}
            title="Go to current location"
          >
            <Crosshair className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm shadow-md"
          >
            <Layers className="h-4 w-4" />
          </Button>
        </div>

        {/* AQI Legend */}
        <Card className="absolute bottom-4 left-4 p-3 bg-background/95 backdrop-blur-sm z-[400] shadow-lg">
          <div className="text-sm font-medium mb-2">AQI Legend</div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#00e400'}} />
              <span>Good (0-50)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ffff00'}} />
              <span>Moderate (51-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ff7e00'}} />
              <span>Unhealthy for Sensitive (101-150)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ff0000'}} />
              <span>Unhealthy (151-200)</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default AQIMap


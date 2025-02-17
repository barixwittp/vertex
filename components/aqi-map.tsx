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

interface SearchResult {
  lat: number;
  lon: number;
  display_name: string;
}

// Add this helper function for temperature conversion
const kelvinToCelsius = (kelvin: number) => {
  return Math.round(kelvin - 273.15)
}

// Add this function to get AQI status text and color
const getAQIStatus = (aqi: number): { text: string; color: string } => {
  if (aqi <= 50) return { text: 'Good', color: '#00e400' }
  if (aqi <= 100) return { text: 'Moderate', color: '#ffff00' }
  if (aqi <= 150) return { text: 'Unhealthy for Sensitive Groups', color: '#ff7e00' }
  if (aqi <= 200) return { text: 'Unhealthy', color: '#ff0000' }
  if (aqi <= 300) return { text: 'Very Unhealthy', color: '#99004c' }
  return { text: 'Hazardous', color: '#7e0023' }
}

export function AQIMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const { location } = useLocation()
  const [map, setMap] = useState<any>(null)
  const [clickedLocation, setClickedLocation] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const { toast } = useToast()

  // Update the search handler
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || !map) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      )
      const data: SearchResult[] = await response.json()

      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0]
        
        // Slower animation (increased duration from 2 to 3 seconds)
        map.flyTo([lat, lon], 12, {
          duration: 3,
          easeLinearity: 0.1 // Made animation smoother
        })

        // Fetch both AQI and weather data
        const [aqiData, weatherResponse] = await Promise.all([
          AQIService.getNearestStation(Number(lat), Number(lon)),
          fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_KEY}`)
        ])

        const weatherData = await weatherResponse.json()

        // Create detailed popup content
        const status = getAQIStatus(aqiData.aqi)
        const popupContent = `
          <div class="p-4">
            <h3 class="font-bold text-base sm:text-lg mb-2 line-clamp-2">${display_name}</h3>
            
            <div class="grid gap-3">
              <div class="bg-background/50 p-3 rounded-lg border border-border/50">
                <div class="text-sm font-medium mb-1">Air Quality</div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div class="text-2xl sm:text-3xl font-bold" style="color: ${status.color}">${aqiData.aqi}</div>
                    <div class="text-xs text-muted-foreground">AQI</div>
                  </div>
                  <div class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm" 
                       style="background-color: ${status.color}20; color: ${status.color}">
                    ${status.text}
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div class="bg-background/50 p-3 rounded-lg border border-border/50">
                  <div class="text-sm font-medium mb-1">Weather</div>
                  <div class="text-xl font-bold">${kelvinToCelsius(weatherData.main.temp)}°C</div>
                  <div class="text-xs text-muted-foreground">${weatherData.weather[0].main}</div>
                </div>
                <div class="bg-background/50 p-3 rounded-lg border border-border/50">
                  <div class="text-sm font-medium mb-1">Humidity</div>
                  <div class="text-xl font-bold">${weatherData.main.humidity}%</div>
                  <div class="text-xs text-muted-foreground">Wind: ${Math.round(weatherData.wind.speed * 3.6)} km/h</div>
                </div>
              </div>

              <div class="bg-background/50 p-3 rounded-lg border border-border/50">
                <div class="text-sm font-medium mb-2">Pollutants</div>
                <div class="grid grid-cols-2 gap-2 text-sm">
                  ${Object.entries(aqiData.pollutants).map(([key, value]) => `
                    <div class="flex items-center justify-between">
                      <span class="text-muted-foreground">${key.toUpperCase()}:</span>
                      <span class="font-medium">${value || 'N/A'}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            </div>
          </div>
        `

        // Add marker with detailed popup
        const locationIcon = createCustomIcon(getAQIColor(aqiData.aqi))
        L.marker([lat, lon], {
          icon: locationIcon,
        })
          .addTo(map)
          .bindPopup(popupContent, {
            maxWidth: 350,
            className: 'custom-popup'
          })
          .openPopup()

        // Add AQI circle with animation
        const circle = L.circle([lat, lon], {
          color: getAQIColor(aqiData.aqi),
          fillColor: getAQIColor(aqiData.aqi),
          fillOpacity: 0,
          radius: 0
        }).addTo(map)

        // Animate the circle
        let opacity = 0
        let radius = 0
        const animate = () => {
          opacity += 0.01
          radius += 100
          if (opacity <= 0.2) {
            circle.setStyle({
              fillOpacity: opacity,
              radius: radius
            })
            requestAnimationFrame(animate)
          }
        }
        animate()

        toast({
          title: "Location found",
          description: `Showing results for ${display_name}`,
        })
      } else {
        toast({
          title: "Location not found",
          description: "Please try a different search term",
          variant: "destructive"
        })
      }
    } catch (error) {
      console.error('Search error:', error)
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
    <div className="fixed inset-0 pt-16">
      {/* Search Bar - Mobile Optimized */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[1000]">
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Search location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-background/95 backdrop-blur-sm shadow-lg border-2 h-11 sm:h-10"
          />
          <Button 
            type="submit" 
            disabled={isSearching}
            className="bg-primary hover:bg-primary/90 text-white shadow-lg h-11 sm:h-10 px-3 sm:px-4"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>

      <div className="w-full h-[calc(100vh-5rem)] pb-16">
        <div 
          ref={mapContainerRef} 
          className="w-full h-full relative" 
          style={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
        />
        
        {/* Map Controls - Mobile Optimized */}
        <div className="absolute top-32 sm:top-20 right-4 flex flex-col gap-2 z-[400]">
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm shadow-lg h-11 w-11 sm:h-10 sm:w-10"
            onClick={goToCurrentLocation}
            title="Go to current location"
          >
            <Crosshair className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="bg-background/95 backdrop-blur-sm shadow-lg h-11 w-11 sm:h-10 sm:w-10"
          >
            <Layers className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {/* AQI Legend - Mobile Optimized */}
        <Card className="absolute bottom-20 left-4 right-4 sm:right-auto p-3 bg-background/95 backdrop-blur-sm z-[400] shadow-lg">
          <div className="text-sm font-medium mb-2">AQI Legend</div>
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-xs map-legend-mobile">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#00e400'}} />
              <span>Good (0-50)</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ffff00'}} />
              <span>Moderate (51-100)</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <div className="w-3 h-3 rounded-full" style={{backgroundColor: '#ff7e00'}} />
              <span>Unhealthy for Sensitive</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
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


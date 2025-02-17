"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search as SearchIcon, MapPin, Globe } from "lucide-react"
import { AQIService, AQIData } from "@/lib/api/aqi-service"
import { useToast } from "@/components/ui/use-toast"

// Add color utility function
function getAQIColor(aqi: number): string {
  if (aqi <= 50) return 'text-green-500';
  if (aqi <= 100) return 'text-yellow-500';
  if (aqi <= 150) return 'text-orange-500';
  if (aqi <= 200) return 'text-red-500';
  if (aqi <= 300) return 'text-purple-500';
  return 'text-rose-900';
}

// Add loading skeleton
function SearchSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-[200px] bg-muted rounded-lg"></div>
        </div>
      ))}
    </div>
  )
}

const recommendedPlaces = [
  {
    name: "New York City",
    country: "USA",
    coordinates: { lat: 40.7128, lng: -74.0060 }
  },
  {
    name: "Tokyo",
    country: "Japan",
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    name: "London",
    country: "UK",
    coordinates: { lat: 51.5074, lng: -0.1278 }
  },
  {
    name: "Delhi",
    country: "India",
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    name: "Beijing",
    country: "China",
    coordinates: { lat: 39.9042, lng: 116.4074 }
  },
  {
    name: "Paris",
    country: "France",
    coordinates: { lat: 48.8566, lng: 2.3522 }
  },
  {
    name: "Mumbai",
    country: "India",
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    name: "Los Angeles",
    country: "USA",
    coordinates: { lat: 34.0522, lng: -118.2437 }
  }
]

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<AQIData[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchTerm.trim()) return

    setLoading(true)
    try {
      const data = await AQIService.searchStations(searchTerm)
      setResults(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search locations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceClick = async (place: typeof recommendedPlaces[0]) => {
    try {
      setLoading(true)
      const data = await AQIService.getNearestStation(
        place.coordinates.lat,
        place.coordinates.lng
      )
      setResults([data])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch air quality data for this location",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-muted-foreground">Search</span>
          <span className="text-primary">Locations</span>
        </h1>
        
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            placeholder="Search cities or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              <SearchIcon className="h-5 w-5" />
            )}
          </Button>
        </form>
      </motion.div>

      {/* Recommended Places */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Recommended Places
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {recommendedPlaces.map((place) => (
            <Card
              key={place.name}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handlePlaceClick(place)}
            >
              <div className="p-4">
                <h3 className="font-medium">{place.name}</h3>
                <p className="text-sm text-muted-foreground">{place.country}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {loading ? (
        <SearchSkeleton />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{result.station}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {result.city}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getAQIColor(result.aqi)}`}>
                      {result.aqi}
                    </div>
                    <div className="text-sm text-muted-foreground">AQI</div>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">PM2.5: </span>
                    {result.pollutants.pm25 > 0 ? (
                      <span className={getAQIColor(result.pollutants.pm25)}>
                        {result.pollutants.pm25.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">PM10: </span>
                    {result.pollutants.pm10 > 0 ? (
                      <span className={getAQIColor(result.pollutants.pm10)}>
                        {result.pollutants.pm10.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">O₃: </span>
                    {result.pollutants.o3 > 0 ? (
                      <span className={getAQIColor(result.pollutants.o3)}>
                        {result.pollutants.o3.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                  <div>
                    <span className="text-muted-foreground">NO₂: </span>
                    {result.pollutants.no2 > 0 ? (
                      <span className={getAQIColor(result.pollutants.no2)}>
                        {result.pollutants.no2.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">N/A</span>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {results.length === 0 && !loading && searchTerm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-8 text-muted-foreground"
        >
          No results found
        </motion.div>
      )}
    </div>
  )
}


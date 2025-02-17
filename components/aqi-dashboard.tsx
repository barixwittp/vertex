"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { AQIGauge } from "@/components/aqi-gauge"
import { WeatherInfo } from "@/components/weather-info"
import { PollutantBreakdown } from "@/components/pollutant-breakdown"
import { HealthAdvice } from "@/components/health-advice"
import { ActivitySuggestions } from "@/components/activity-suggestions"
import { useLocation } from "@/components/location-provider"
import { AQIService, AQIData } from '@/lib/api/aqi-service'
import { Loader2, Wind, Droplets, Thermometer, AlertTriangle } from "lucide-react"
import { motion } from "framer-motion"

const getAQIStatus = (aqi: number): { text: string; color: string; description: string } => {
  if (aqi <= 50) return { 
    text: 'Good', 
    color: '#00e400',
    description: 'Air quality is satisfactory, and air pollution poses little or no risk.'
  }
  if (aqi <= 100) return { 
    text: 'Moderate', 
    color: '#ffff00',
    description: 'Air quality is acceptable. However, there may be a risk for some people.'
  }
  if (aqi <= 150) return { 
    text: 'Unhealthy for Sensitive Groups', 
    color: '#ff7e00',
    description: 'Members of sensitive groups may experience health effects.'
  }
  if (aqi <= 200) return { 
    text: 'Unhealthy', 
    color: '#ff0000',
    description: 'Everyone may begin to experience health effects.'
  }
  return { 
    text: 'Very Unhealthy', 
    color: '#99004c',
    description: 'Health warnings of emergency conditions. Everyone is more likely to be affected.'
  }
}

export function AQIDashboard() {
  const { location, loading: locationLoading, error: locationError } = useLocation()
  const [aqiData, setAqiData] = useState<AQIData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      if (location) {
        try {
          setLoading(true)
          const data = await AQIService.getNearestStation(
            location.latitude,
            location.longitude
          )
          setAqiData(data)
          setError(null)
        } catch (err) {
          console.error('Error fetching AQI data:', err)
          setError('Failed to fetch air quality data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchData()
  }, [location])

  if (locationLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    )
  }

  if (locationError || error) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-destructive">
          {locationError || error || 'Something went wrong'}
        </div>
      </div>
    )
  }

  if (!aqiData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">No data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      {aqiData && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          <Card className="p-4 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-semibold mb-2">Air Quality Status</h3>
              <div className="text-3xl font-bold mb-1" style={{ color: getAQIStatus(aqiData.aqi).color }}>
                {getAQIStatus(aqiData.aqi).text}
              </div>
              <p className="text-sm text-muted-foreground">{getAQIStatus(aqiData.aqi).description}</p>
            </div>
            <div 
              className="absolute inset-0 opacity-10"
              style={{ backgroundColor: getAQIStatus(aqiData.aqi).color }}
            />
          </Card>

          {/* Add more status cards for temperature, humidity, etc. */}
          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Temperature</h3>
                <div className="text-3xl font-bold">24°C</div>
              </div>
              <Thermometer className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Humidity</h3>
                <div className="text-3xl font-bold">65%</div>
              </div>
              <Droplets className="h-6 w-6 text-primary" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Wind Speed</h3>
                <div className="text-3xl font-bold">12 km/h</div>
              </div>
              <Wind className="h-6 w-6 text-primary" />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Existing cards with updated styling */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h2 className="text-lg font-semibold mb-4">Current AQI</h2>
              <div className="text-4xl font-bold mb-2">{aqiData?.aqi}</div>
              <div className="text-muted-foreground">
                {location?.city}, {location?.country}
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Major Pollutants</h2>
              <div className="space-y-2">
                <div>PM2.5: {aqiData.pollutants.pm25}</div>
                <div>PM10: {aqiData.pollutants.pm10}</div>
                <div>O3: {aqiData.pollutants.o3}</div>
                <div>NO2: {aqiData.pollutants.no2}</div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Health Recommendations</h2>
          <HealthAdvice aqi={aqiData.aqi} />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Activity Suggestions</h2>
          <ActivitySuggestions aqi={aqiData.aqi} />
        </Card>

        <Card className="p-4">
          <h2 className="text-lg font-semibold mb-4">Pollutant Breakdown</h2>
          <PollutantBreakdown pollutants={aqiData.pollutants} />
        </Card>
      </div>
    </div>
  )
}


"use client"

import { Sun, Cloud, CloudRain, Thermometer } from "lucide-react"

interface WeatherInfoProps {
  temperature: number
  weather: string
}

export function WeatherInfo({ temperature, weather }: WeatherInfoProps) {
  const getWeatherIcon = () => {
    switch (weather) {
      case "Sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "Cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "Rain Shower":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Cloud className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="flex items-center gap-4">
      {getWeatherIcon()}
      <div>
        <div className="flex items-center gap-1">
          <Thermometer className="h-4 w-4 text-muted-foreground" />
          <p className="text-2xl font-bold">{temperature}°</p>
        </div>
        <p className="text-sm text-muted-foreground">{weather}</p>
      </div>
    </div>
  )
}


"use client"

import { Card } from "@/components/ui/card"
import { Cloud, CloudRain } from "lucide-react"

export function WeatherForecast() {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Weather</h2>
      <div className="flex items-center gap-4">
        <CloudRain className="h-8 w-8 text-blue-500" />
        <div>
          <p className="text-2xl font-bold">15°</p>
          <p className="text-sm text-muted-foreground">Rain Shower</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-7 gap-2">
        {[15, 14, 13, 12, 12, 11, 11].map((temp, i) => (
          <Card key={i} className="p-2 text-center">
            <Cloud className="h-4 w-4 mx-auto mb-1" />
            <span className="text-sm">{temp}°</span>
          </Card>
        ))}
      </div>
    </div>
  )
}


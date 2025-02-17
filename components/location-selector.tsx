"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ChevronLeft, MapPin } from "lucide-react"

interface LocationSelectorProps {
  location: string
  onLocationChange: (location: string) => void
}

export function LocationSelector({ location, onLocationChange }: LocationSelectorProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h1 className="font-semibold">{location}</h1>
          </div>
          <p className="text-sm text-muted-foreground">Birmingham</p>
        </div>
      </div>
    </Card>
  )
}


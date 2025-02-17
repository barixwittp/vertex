"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Bell, MapPin, Trash2 } from "lucide-react"

export function SettingsPage() {
  const [savedLocations, setSavedLocations] = useState<string[]>([])
  const [newLocation, setNewLocation] = useState("")
  const { toast } = useToast()

  const handleAddLocation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (newLocation && !savedLocations.includes(newLocation)) {
      setSavedLocations([...savedLocations, newLocation])
      setNewLocation("")
      toast({
        title: "Location added",
        description: `${newLocation} has been added to your saved locations.`
      })
    }
  }

  const handleRemoveLocation = (location: string) => {
    setSavedLocations(savedLocations.filter(loc => loc !== location))
    toast({
      title: "Location removed",
      description: `${location} has been removed from your saved locations.`
    })
  }

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive alerts about air quality changes
              </p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Daily Reports</Label>
              <p className="text-sm text-muted-foreground">
                Get daily air quality summaries
              </p>
            </div>
            <Switch />
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Saved Locations</h2>
        <form onSubmit={handleAddLocation} className="flex gap-2 mb-4">
          <Input
            placeholder="Add a location..."
            value={newLocation}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLocation(e.target.value)}
          />
          <Button type="submit" disabled={!newLocation.trim()}>
            <MapPin className="h-4 w-4 mr-2" />
            Add
          </Button>
        </form>
        <div className="space-y-2">
          {savedLocations.map((location) => (
            <div key={location} className="flex items-center justify-between p-2 bg-muted rounded-lg">
              <span>{location}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveLocation(location)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
          {savedLocations.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No saved locations yet
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}


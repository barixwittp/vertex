"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"

export function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [savedLocations, setSavedLocations] = useState(["New York", "London", "Tokyo"])
  const [newLocation, setNewLocation] = useState("")

  const handleAddLocation = (e) => {
    e.preventDefault()
    if (newLocation && !savedLocations.includes(newLocation)) {
      setSavedLocations([...savedLocations, newLocation])
      setNewLocation("")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-toggle">Dark Mode</Label>
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
          />
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-toggle">Enable Notifications</Label>
          <Switch id="notifications-toggle" checked={notifications} onCheckedChange={setNotifications} />
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">Saved Locations</h2>
        <form onSubmit={handleAddLocation} className="flex gap-2 mb-4">
          <Input placeholder="Add new location" value={newLocation} onChange={(e) => setNewLocation(e.target.value)} />
          <Button type="submit">Add</Button>
        </form>
        <ul className="space-y-2">
          {savedLocations.map((location, index) => (
            <li key={index} className="flex justify-between items-center">
              {location}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSavedLocations(savedLocations.filter((_, i) => i !== index))}
              >
                Remove
              </Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Location {
  name: string
  aqi: number
  temperature: number
  weather: string
}

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void
}

export function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")

  // Mock locations data
  const locations = [
    { name: "New York", aqi: 85, temperature: 22, weather: "Sunny" },
    { name: "London", aqi: 65, temperature: 18, weather: "Cloudy" },
    { name: "Tokyo", aqi: 95, temperature: 25, weather: "Clear" },
    { name: "Paris", aqi: 70, temperature: 20, weather: "Partly Cloudy" },
  ]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search locations..."
            className="pl-8"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder="Search locations..." />
          <CommandList>
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {locations.map((location) => (
                <CommandItem
                  key={location.name}
                  onSelect={() => {
                    onLocationSelect(location)
                    setValue(location.name)
                    setOpen(false)
                  }}
                >
                  {location.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


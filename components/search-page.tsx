"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Search } from "lucide-react"
import { AQIGauge } from "@/components/aqi-gauge"

export function SearchPage() {
  const [searchResults, setSearchResults] = useState([])

  const handleSearch = async (e) => {
    e.preventDefault()
    const query = e.target.search.value
    // Implement actual API call here
    const mockResults = [
      { name: "New York", aqi: 50 },
      { name: "Los Angeles", aqi: 80 },
      { name: "Chicago", aqi: 30 },
    ]
    setSearchResults(mockResults)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input name="search" placeholder="Search for a city..." />
        <Button type="submit">
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((result, index) => (
          <Card key={index} className="p-4">
            <h3 className="text-lg font-semibold mb-2">{result.name}</h3>
            <AQIGauge value={result.aqi} size="small" />
          </Card>
        ))}
      </div>
    </div>
  )
}


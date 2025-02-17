"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search as SearchIcon } from "lucide-react"

interface SearchResult {
  id: number;
  name: string;
  aqi: number;
  location: string;
}

export function SearchPage() {
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const query = formData.get('search') as string

    if (!query.trim()) return

    setLoading(true)
    try {
      // Implement actual API call here
      const mockResults: SearchResult[] = [
        {
          id: 1,
          name: "Test Location",
          aqi: 50,
          location: "Test City"
        }
      ]
      setSearchResults(mockResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          type="search"
          name="search"
          placeholder="Search locations..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading}>
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-current" />
          ) : (
            <SearchIcon className="h-4 w-4" />
          )}
        </Button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {searchResults.map((result) => (
          <Card key={result.id} className="p-4">
            <h3 className="font-semibold">{result.name}</h3>
            <p className="text-sm text-muted-foreground">{result.location}</p>
            <div className="mt-2">
              <span className="text-lg font-bold">{result.aqi}</span>
              <span className="text-sm text-muted-foreground ml-1">AQI</span>
            </div>
          </Card>
        ))}
      </div>

      {searchResults.length === 0 && (
        <div className="text-center text-muted-foreground py-8">
          No results found
        </div>
      )}
    </div>
  )
}


import { Card } from "@/components/ui/card"

interface ActivitySuggestionsProps {
  aqi: number;
}

export function ActivitySuggestions({ aqi }: ActivitySuggestionsProps) {
  const getActivitySuggestions = (aqi: number) => {
    if (aqi <= 50) {
      return ["Outdoor sports", "Walking", "Cycling", "All outdoor activities"];
    } else if (aqi <= 100) {
      return ["Light outdoor activities", "Short walks", "Limited outdoor time"];
    } else if (aqi <= 150) {
      return ["Indoor activities recommended", "Limit outdoor exercise", "Wear mask if going outside"];
    } else {
      return ["Stay indoors", "Close windows", "Use air purifier", "Avoid outdoor activities"];
    }
  };

  const suggestions = getActivitySuggestions(aqi);

  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Activity Suggestions</h2>
      <ul className="list-disc pl-5 space-y-1">
        {suggestions.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </Card>
  )
}


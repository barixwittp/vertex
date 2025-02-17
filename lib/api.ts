export async function fetchAQIData(lat: number, lon: number) {
  // In a real application, you would make an API call here
  // For this example, we'll return mock data
  return {
    aqi: Math.floor(Math.random() * 300),
    temperature: Math.floor(Math.random() * 30) + 10,
    humidity: Math.floor(Math.random() * 100),
    windSpeed: Math.floor(Math.random() * 20),
    pollutants: {
      pm25: Math.floor(Math.random() * 100),
      pm10: Math.floor(Math.random() * 100),
      o3: Math.floor(Math.random() * 100),
      no2: Math.floor(Math.random() * 100),
      so2: Math.floor(Math.random() * 100),
      co: Math.floor(Math.random() * 100),
    },
    historicalData: Array.from({ length: 7 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      aqi: Math.floor(Math.random() * 300),
    })),
  }
}


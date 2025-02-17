import { AQIDashboard } from "@/components/aqi-dashboard"

export default function Home() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="sr-only">VayuSathi - Air Quality Index Monitor</h1>
      <AQIDashboard />
    </div>
  )
}


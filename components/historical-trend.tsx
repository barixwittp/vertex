"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

export function HistoricalTrend({ data }) {
  return (
    <Card className="p-4">
      <h2 className="text-lg font-semibold mb-4">Historical AQI Trend</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="aqi" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}


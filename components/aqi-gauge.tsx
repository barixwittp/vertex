"use client"

import { PieChart, Pie, Cell } from "recharts"

interface AQIGaugeProps {
  value: number
  label: string
}

export function AQIGauge({ value, label }: AQIGaugeProps) {
  const data = [
    { value: value },
    { value: 6 - value }, // 6 is max AQI level
  ]

  const COLORS = ["var(--color-gauge)", "#f3f4f6"]

  return (
    <div className="relative w-48 h-48 mx-auto">
      <PieChart width={192} height={192}>
        <Pie
          data={data}
          cx={96}
          cy={96}
          startAngle={180}
          endAngle={0}
          innerRadius={60}
          outerRadius={90}
          paddingAngle={0}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
      </PieChart>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}


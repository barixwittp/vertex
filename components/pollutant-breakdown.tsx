"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface PollutantBreakdownProps {
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2?: number;
    co?: number;
  };
}

export function PollutantBreakdown({ pollutants }: PollutantBreakdownProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {Object.entries(pollutants)
        .filter(([_, value]) => value !== undefined)
        .map(([key, value]) => (
          <div key={key} className="p-3 bg-card rounded-lg">
            <div className="text-sm text-muted-foreground uppercase">{key}</div>
            <div className="text-xl font-semibold">{value}</div>
          </div>
        ))}
    </div>
  );
}


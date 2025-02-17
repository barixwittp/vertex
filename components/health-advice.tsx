interface HealthAdviceProps {
  aqi: number
}

export function HealthAdvice({ aqi }: HealthAdviceProps) {
  const getHealthAdvice = (aqi: number) => {
    if (aqi <= 50) {
      return "Air quality is good. Perfect for outdoor activities.";
    } else if (aqi <= 100) {
      return "Air quality is moderate. Sensitive individuals should limit prolonged outdoor exposure.";
    } else if (aqi <= 150) {
      return "Members of sensitive groups may experience health effects.";
    } else if (aqi <= 200) {
      return "Everyone may begin to experience health effects.";
    } else {
      return "Health warnings of emergency conditions. Everyone should avoid outdoor activities.";
    }
  };

  return (
    <div className="text-base">
      {getHealthAdvice(aqi)}
    </div>
  );
}


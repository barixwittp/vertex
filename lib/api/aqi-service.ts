const WAQI_API_KEY = process.env.NEXT_PUBLIC_WAQI_TOKEN;
const OPENWEATHER_API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
const WAQI_BASE_URL = 'https://api.waqi.info';
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface LocationDetails {
  city: string;
  state?: string;
  country: string;
  formatted_address?: string;
}

export interface AQIData {
  aqi: number;
  station: string;
  city?: string;
  time: string;
  pollutants: {
    pm25: number;
    pm10: number;
    o3: number;
    no2: number;
    so2?: number;
    co?: number;
  };
  location?: {
    lat: number;
    lng: number;
  };
  locationDetails?: LocationDetails;
}

// Add caching for API responses
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map();

export class AQIService {
  private static async fetchWithCache(url: string) {
    const cached = cache.get(url);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    const response = await fetch(url);
    const data = await response.json();
    
    cache.set(url, {
      data,
      timestamp: Date.now()
    });

    return data;
  }

  static async getNearestStation(lat: number, lng: number): Promise<AQIData> {
    try {
      const url = `${WAQI_BASE_URL}/feed/geo:${lat};${lng}/?token=${WAQI_API_KEY}`;
      const data = await this.fetchWithCache(url);

      // Get location details from OpenWeather Geocoding API
      const locationResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      const locationData = await locationResponse.json();
      const locationDetails = locationData[0] ? {
        city: locationData[0].name,
        state: locationData[0].state,
        country: locationData[0].country,
        formatted_address: `${locationData[0].name}, ${locationData[0].state || ''} ${locationData[0].country}`
      } : undefined;

      if (data.status !== 'ok') {
        throw new Error('Failed to fetch AQI data');
      }

      return {
        aqi: data.data.aqi,
        station: data.data.city.name,
        city: locationDetails?.city || data.data.city.name,
        time: new Date().toISOString(),
        pollutants: {
          pm25: data.data.iaqi?.pm25?.v || 0,
          pm10: data.data.iaqi?.pm10?.v || 0,
          o3: data.data.iaqi?.o3?.v || 0,
          no2: data.data.iaqi?.no2?.v || 0,
        },
        location: {
          lat: data.data.city.geo[0],
          lng: data.data.city.geo[1]
        },
        locationDetails
      };
    } catch (error) {
      console.error('Error fetching AQI data:', error);
      throw error;
    }
  }

  private static async getOpenWeatherData(lat: number, lng: number): Promise<AQIData | null> {
    try {
      const response = await fetch(
        `${OPENWEATHER_BASE_URL}/air_pollution?lat=${lat}&lon=${lng}&appid=${OPENWEATHER_API_KEY}`
      );
      const data = await response.json();

      if (!data.list || !data.list[0]) {
        throw new Error('Invalid OpenWeather data');
      }

      const components = data.list[0].components;
      const aqi = data.list[0].main.aqi;

      return {
        aqi: this.convertOpenWeatherAQI(aqi),
        station: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
        city: `Location (${lat.toFixed(2)}, ${lng.toFixed(2)})`,
        time: new Date().toISOString(),
        pollutants: {
          pm25: components.pm2_5 || 0,
          pm10: components.pm10 || 0,
          o3: components.o3 || 0,
          no2: components.no2 || 0,
        },
        location: {
          lat,
          lng
        }
      };
    } catch (error) {
      console.error('OpenWeather API error:', error);
      return null;
    }
  }

  private static async getWAQIData(lat: number, lng: number): Promise<AQIData> {
    const response = await fetch(
      `${WAQI_BASE_URL}/feed/geo:${lat};${lng}/?token=${WAQI_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('Failed to fetch WAQI data');
    }

    return {
      aqi: data.data.aqi,
      station: data.data.city.name,
      city: data.data.city.name,
      time: data.data.time.iso,
      pollutants: {
        pm25: data.data.iaqi.pm25?.v || 0,
        pm10: data.data.iaqi.pm10?.v || 0,
        o3: data.data.iaqi.o3?.v || 0,
        no2: data.data.iaqi.no2?.v || 0,
      },
      location: data.data.city.geo ? {
        lat: data.data.city.geo[0],
        lng: data.data.city.geo[1]
      } : undefined,
    };
  }

  // Convert OpenWeather AQI (1-5) to a more standard 0-500 scale
  private static convertOpenWeatherAQI(openWeatherAQI: number): number {
    const aqiRanges: Record<number, number> = {
      1: 25,  // Good
      2: 75,  // Fair
      3: 150, // Moderate
      4: 200, // Poor
      5: 300  // Very Poor
    };
    return aqiRanges[openWeatherAQI as keyof typeof aqiRanges] || 0;
  }

  static async searchStations(query: string): Promise<AQIData[]> {
    const cacheKey = `search:${query}`
    return this.fetchWithCache(cacheKey, async () => {
      try {
        const url = `${WAQI_BASE_URL}/search/?token=${WAQI_API_KEY}&keyword=${encodeURIComponent(query)}`
        const response = await fetch(url)
        const data = await response.json()
        
        if (data.status !== 'ok') {
          throw new Error('Failed to search stations')
        }

        // Fetch detailed data for each station
        const detailedData = await Promise.all(
          data.data.slice(0, 10).map(async (station: any) => { // Limit to 10 stations for faster loading
            try {
              const detailResponse = await fetch(
                `${WAQI_BASE_URL}/feed/@${station.uid}/?token=${WAQI_API_KEY}`
              )
              const detailData = await detailResponse.json()
              
              if (detailData.status === 'ok') {
                return {
                  aqi: station.aqi,
                  station: station.station.name,
                  city: station.station.city || station.station.name,
                  time: new Date().toISOString(),
                  pollutants: {
                    pm25: detailData.data.iaqi?.pm25?.v || 0,
                    pm10: detailData.data.iaqi?.pm10?.v || 0,
                    o3: detailData.data.iaqi?.o3?.v || 0,
                    no2: detailData.data.iaqi?.no2?.v || 0,
                  },
                  location: detailData.data.city.geo ? {
                    lat: detailData.data.city.geo[0],
                    lng: detailData.data.city.geo[1]
                  } : undefined,
                }
              }
            } catch (error) {
              console.error('Error fetching station details:', error)
            }
            
            return null
          })
        )

        return detailedData.filter(Boolean)
      } catch (error) {
        console.error('Error searching stations:', error)
        throw error
      }
    })
  }
} 
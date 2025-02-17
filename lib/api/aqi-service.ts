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
    latitude: number;
    longitude: number;
  };
  locationDetails?: LocationDetails;
}

// Add caching for API responses
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

interface CacheItem<T> {
  data: T;
  timestamp: number;
}

export class AQIService {
  private static cache: Map<string, CacheItem<any>> = new Map();

  private static async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>
  ): Promise<T> {
    const cached = this.cache.get(key);
    const now = Date.now();

    if (cached && now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }

    try {
      const data = await fetchFn();
      this.cache.set(key, { data, timestamp: now });
      return data;
    } catch (error) {
      console.error('Cache fetch error:', error);
      throw error;
    }
  }

  static async getNearestStation(lat: number, lon: number): Promise<AQIData> {
    const cacheKey = `station:${lat},${lon}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      try {
        const url = `${WAQI_BASE_URL}/feed/geo:${lat};${lon}/?token=${WAQI_API_KEY}`;
        console.log('Fetching AQI data from:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (data.status !== 'ok' || !data.data) {
          throw new Error(data.data || 'Invalid response from AQI API');
        }

        return this.transformStationData(data.data);
      } catch (error) {
        console.error('Error fetching AQI data:', error);
        throw new Error('Failed to fetch AQI data');
      }
    });
  }

  static async searchStations(query: string): Promise<AQIData[]> {
    const cacheKey = `search:${query}`;
    
    return this.fetchWithCache(cacheKey, async () => {
      try {
        const url = `${WAQI_BASE_URL}/search/?token=${WAQI_API_KEY}&keyword=${encodeURIComponent(query)}`;
        console.log('Searching stations at:', url);
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.status !== 'ok' || !data.data) {
          throw new Error(data.data || 'Invalid response from search API');
        }

        return data.data.map(this.transformStationData);
      } catch (error) {
        console.error('Error searching stations:', error);
        throw new Error('Failed to search stations');
      }
    });
  }

  private static transformStationData(data: any): AQIData {
    if (!data || typeof data.aqi === 'undefined') {
      throw new Error('Invalid station data');
    }

    return {
      aqi: data.aqi,
      station: data.station?.name || 'Unknown Station',
      city: data.city?.name,
      time: data.time?.iso || new Date().toISOString(),
      pollutants: {
        pm25: data.iaqi?.pm25?.v || 0,
        pm10: data.iaqi?.pm10?.v || 0,
        o3: data.iaqi?.o3?.v || 0,
        no2: data.iaqi?.no2?.v || 0,
        so2: data.iaqi?.so2?.v,
        co: data.iaqi?.co?.v
      },
      location: data.city?.geo ? {
        latitude: data.city.geo[0],
        longitude: data.city.geo[1]
      } : undefined
    };
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
          latitude: lat,
          longitude: lng
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
        latitude: data.data.city.geo[0],
        longitude: data.data.city.geo[1]
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
} 
import { API_CONFIG } from "./config";
import {
  Coordinates,
  ForecostData,
  GeocodingResponse,
  WeatherData,
} from "./types";

class WeatherAPI {
  // this is for teh create teh APi url by using the endpoints
  private createUrl(endpoint: string, params: Record<string, string | number>) {
    const searchParams = new URLSearchParams({
      appid: API_CONFIG.API_KEY,
      ...params,
    });

    return `${endpoint}?${searchParams.toString()}`;
  }

  //   This is fetchinng the the data from the API
  private async fetchData<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API Error: ${response.statusText}`);
    }

    return response.json();
  }
  async getCurrentWeather({ lat, lon }: Coordinates): Promise<WeatherData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/weather`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.unit,
    });
    return this.fetchData<WeatherData>(url);
  }

  async getForecast({ lat, lon }: Coordinates): Promise<ForecostData> {
    const url = this.createUrl(`${API_CONFIG.BASE_URL}/forecast`, {
      lat: lat.toString(),
      lon: lon.toString(),
      units: API_CONFIG.DEFAULT_PARAMS.unit,
    });
    return this.fetchData<ForecostData>(url);
  }

  async reverseGeoCode({
    lat,
    lon,
  }: Coordinates): Promise<GeocodingResponse[]> {
    const url = this.createUrl(`${API_CONFIG.GEO}/reverse`, {
      lat: lat.toString(),
      lon: lon.toString(),
      limit: 1,
    });
    return this.fetchData<GeocodingResponse[]>(url);
  }
}

export const weatherAPI = new WeatherAPI();

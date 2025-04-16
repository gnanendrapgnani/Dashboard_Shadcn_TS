export const API_CONFIG = {
  BASE_URL: "https://api.openweather.org/data/2.5",
  GEO: "http://api.openweathermap.org/geo/1.0",
  API_KEY: import.meta.env.VITE_API_OPENWEATHER_API_KEY,
  DEFAULT_PARAMS: {
    unit: "metric",
    appid: import.meta.env.VITE_API_OPENWEATHER_API_KEY,
  },
};

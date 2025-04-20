import CurrentWeather from "@/components/CurrentWeather";
import FavoriteButton from "@/components/favoriteButton";
import { HourlyTempature } from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skelton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import WeatherForecast from "@/components/weather-forecast";
import WeatherDetails from "@/components/WeatherDetails";
import { useForcastQuery, useWeatherQuery } from "@/hooks/use-weather";
import { AlertCircle } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const CityPage = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  const coordinates = { lat, lon };
  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForcastQuery(coordinates);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather Data. Please try again</p>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* Favorite Cites */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys.country}
        </h1>
        <div>
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      {/* current and hourly weather */}
      <div className="grid gap-6">
        <div className="flex flex-col  gap-4">
          {/* current weather */}
          <CurrentWeather data={weatherQuery.data} />

          {/* houly tempeature */}
          <HourlyTempature data={forecastQuery.data} />
        </div>
        <div className="grid gap-6 md:grid-cols-2 items-start">
          {/* details */}
          <WeatherDetails data={weatherQuery.data} />
          {/* forecast */}
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;

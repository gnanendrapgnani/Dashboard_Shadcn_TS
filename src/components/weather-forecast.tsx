import type { ForecastData } from "@/api/types";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ArrowDown, ArrowUp, Droplets, Wind } from "lucide-react";

interface weatherForecastProps {
  data: ForecastData;
}

interface DailyForecast {
  date: number;
  temp_min: number;
  temp_max: number;
  humdity: number;
  wind: number;
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  };
}

const WeatherForecast = ({ data }: weatherForecastProps) => {
  const { list } = data;

  const dailyForecasts = list.reduce((accu, currForecst) => {
    const date = format(new Date(currForecst.dt * 1000), "yyyy-MM-dd");

    if (!accu[date]) {
      accu[date] = {
        temp_min: currForecst.main.temp_min,
        temp_max: currForecst.main.temp_max,
        humdity: currForecst.main.humidity,
        wind: currForecst.wind.speed,
        weather: currForecst.weather[0],
        date: currForecst.dt,
      };
    } else {
      accu[date].temp_min = Math.min(
        accu[date].temp_min,
        currForecst.main.temp_min
      );
      accu[date].temp_max = Math.max(
        accu[date].temp_max,
        currForecst.main.temp_max
      );
    }

    return accu;
  }, {} as Record<string, DailyForecast>);

  const nextDays = Object.values(dailyForecasts).slice(0, 6);
  const formatTemp = (temp: number) => `${Math.round(temp)}°`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>5-Days Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {nextDays.map((day) => {
            return (
              <div
                key={day.date}
                className="grid grid-cols-3 items-center gap-4 rounded-lg border p-4"
              >
                <div>
                  <p className="text-sm text-muted-foreground capitalize">
                    {format(new Date(day.date * 1000), "EEE, MM, dd")}
                  </p>
                  <p>{day.weather.description}</p>
                </div>

                <div className="flex justify-center gap-4">
                  <span className="flex items-center text-blue-500">
                    <ArrowDown className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_min)}
                  </span>

                  <span className="flex items-center text-red-500">
                    <ArrowUp className="mr-1 h-4 w-4" />
                    {formatTemp(day.temp_max)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 ">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Humidity</p>
                      <p className="text-sm text-muted-foreground">
                        {day.humdity}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ">
                    <Wind className="h-4 w-4 text-blue-500" />
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">Wind Speed</p>
                      <p className="text-sm text-muted-foreground">
                        {day.wind} m/s
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherForecast;

import type { Coordinates } from "@/api/types";
import { useQuery } from "@tanstack/react-query";

export function useWeatherQuery(coordinates: Coordinates) {
  useQuery({
    queryKey: ["weather"],
  });
}

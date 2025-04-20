import { useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { Clock, Loader2, Search, Star, XCircle } from "lucide-react";
import { useLocationSeacrh } from "@/hooks/use-weather";
import { CommandSeparator } from "cmdk";
import { useNavigate } from "react-router-dom";
import { useSearchHistory } from "@/hooks/search-history";
import { format } from "date-fns";
import { useFavorite } from "@/hooks/use-favorite";

const CitySearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { data: location, isLoading } = useLocationSeacrh(query);
  const { history, addToHistory, clearHistory } = useSearchHistory();

  const handleOnSelect = (cityData: string) => {
    // Parse the city data string
    const [lat, lon, name, country] = cityData
      .split("|")
      .map((item) => item.trim());

    // Add to search history
    addToHistory.mutate({
      query,
      name,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      country,
    });

    // Close the dialog
    setOpen(false);

    // Navigate to the city page with clean URL format
    // Using query parameters for lat and lon only
    navigate(`/city/${name}?lat=${lat}&lon=${lon}`);
  };

  const { favorites } = useFavorite();

  return (
    <>
      <Button
        variant={"outline"}
        className="relative w-full justify-start text-sm text-muted-foreground sm:pr-2 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search City....
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Search Cities..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {query.length > 2 && !isLoading && (
            <CommandEmpty>No Cities found.</CommandEmpty>
          )}

          {favorites.length > 0 && (
            <>
              <CommandGroup heading="Favorites">
                {favorites.map((loct) => {
                  return (
                    <CommandItem
                      key={loct.id}
                      value={`${loct.lat}|${loct.lon}|${loct.name}|${loct.country}`}
                      onSelect={handleOnSelect}
                    >
                      <Star className="mr-2 h-4 w-4 text-yellow-500" />
                      <span>{loct.name}</span>
                      {loct.state && (
                        <span className="text-sm text-muted-foreground">
                          , {loct.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {" " + loct.country}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}

          {history.length > 0 && (
            <>
              <CommandSeparator />
              <CommandGroup>
                <div className="flex items-center justify-between px-2 my-2">
                  <p>Recent Searches</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => clearHistory.mutate()}
                  >
                    <XCircle className="h-4 w-4" />
                    clear
                  </Button>
                </div>
                {history.map((loct) => {
                  return (
                    <CommandItem
                      key={`${loct.lat}-${loct.lon}`}
                      value={`${loct.lat}|${loct.lon}|${loct.name}|${loct.country}`}
                      onSelect={handleOnSelect}
                    >
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{loct.name}</span>
                      {loct.state && (
                        <span className="text-sm text-muted-foreground">
                          , {loct.state}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {" " + loct.country}
                      </span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {format(loct.serachedAt, "MMM d, h:mm a")}
                      </span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </>
          )}
          <CommandSeparator />

          {location && location.length > 0 && (
            <CommandGroup heading="Suggestion">
              {isLoading && (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              )}
              {location.map((loct) => {
                return (
                  <CommandItem
                    key={`${loct.lat}-${loct.lon}`}
                    value={`${loct.lat}|${loct.lon}|${loct.name}|${loct.country}`}
                    onSelect={handleOnSelect}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    <span>{loct.name}</span>
                    {loct.state && (
                      <span className="text-sm text-muted-foreground">
                        , {loct.state}
                      </span>
                    )}
                    <span className="text-sm text-muted-foreground">
                      {" " + loct.country}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default CitySearch;

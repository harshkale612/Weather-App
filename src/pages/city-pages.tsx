import { useParams, useSearchParams } from "react-router-dom";
import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import CurrentWeather from "../components/CurrentWeather";
import HourlyTemperature from "../components/HourlyTemperature";
import WeatherDetails from "../components/WeatherDetails";
import WeatherForecast from "../components/WeatherForecast";
import WeatherSkeleton from "../components/weather-skeleton";
import FavoriteButton from "@/components/FavoriteButton";
import { GeocodingResponse } from "@/api/types";

const CityPage = () => {

  const [searchParams] = useSearchParams();
  const params = useParams();

  const lat = parseFloat(searchParams.get("lat") || "0");
  const lon = parseFloat(searchParams.get("lon") || "0");

  console.log("params: " + params.cityName);
  const coordinates = { lat, lon };

  console.log("Coordinates:", coordinates);
  console.log("City Name:", params.cityName);

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);

    // new added
    const location: GeocodingResponse = {
      name: params.cityName || "Unknown",
      country: weatherQuery.data?.sys?.country || "Unknown",
      lat: 0, // Default latitude
      lon: 0, // Default longitude
    };

  console.log("Weather Data:", weatherQuery.data);

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load weather data. Please try again.
        </AlertDescription> 
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data || !params.cityName) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">
          {params.cityName}, {weatherQuery.data.sys?.country || "Unknown"}
        </h1>
        <div className="flex gap-2">
          <FavoriteButton
            data={{ ...weatherQuery.data, name: params.cityName }}
          />
        </div>
      </div>

      <div className="grid gap-6">
      <CurrentWeather
        data={weatherQuery.data}
        locationName={location}
        //locationName={params?.cityName || "Unknown"}
        />

        <HourlyTemperature data={forecastQuery.data} />
        <div className="grid gap-6 md:grid-cols-2 items-start">
          <WeatherDetails data={weatherQuery.data} />
          <WeatherForecast data={forecastQuery.data} />
        </div>
      </div>
    </div>
  );
};

export default CityPage;

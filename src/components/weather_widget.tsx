"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedLocation = location.trim();
        
        if (trimmedLocation === "") {
            setError("Please enter a valid location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if (!response.ok) {
                throw new Error("City not found");
            }
            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };
            setWeather(weatherData);
        } catch (error) {
            setError("City not found. Please try again.");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    function getTemperatureMessage(temperature: number, unit: string): string {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
            } else if (temperature < 30) {
                return `It is a pleasant at ${temperature}°C. Enjoy the nice weather.`;
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`;
            }
        } else {
            return `${temperature}°${unit}`;
        }
    }

    function getWeatherData(description: string): string {
        switch (description.toLowerCase()) {
            case "sunny":
                return "It's a peaceful sunny day";
            case "partly cloudy":
                return "It's a beautiful cloudy day";
            case "overcast":
                return "The sky is overcast";
            case "rain":
                return "It's a rainy day! Don't forget your umbrella";
            case "thunderstorm":
                return "Avoid going outside! Thunderstorms are expected";
            case "mist":
                return "It's misty outside";
            case "fog":
                return "Be careful, there's fog outside";
            default:
                return description;
        }
    }

    function getLocationMessage(location: string): string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at night" : "during the day"}`;
    }

    return (
        <div className="flex flex-col justify-center items-center min-h-screen" style={{ backgroundImage: 'url("https://img.freepik.com/premium-vector/sky-clouds-design-with-flat-cartoon-poster-flyers-postcards-web-banners_771576-58.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
            <Card className="w-full max-w-md shadow-lg bg-white rounded-lg overflow-hidden">
                <CardHeader className="bg-blue-600 text-white p-4 rounded-t-lg">
                    <CardTitle className="text-center text-xl font-bold">Weather Widget</CardTitle>
                    <CardDescription className="text-center text-sm">Get real-time weather updates</CardDescription>
                </CardHeader>
                <CardContent className="p-4">
                    <form onSubmit={handleSearch} className="flex flex-col space-y-4">
                        <Input
                            type="text"
                            placeholder="Enter Location"
                            value={location}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                            className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                        <Button type="submit" className="flex items-center justify-center p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                            {isLoading ? "Loading..." : "Search"}
                        </Button>
                    </form>
                    {error && <p className="text-red-500 mt-4">{error}</p>}
                    {weather && (
                        <div className="mt-4 p-4 border rounded-lg bg-blue-50 shadow-inner">
                            <div className="flex items-center space-x-2">
                                <MapPinIcon className="w-6 h-6 text-blue-500" />
                                <p>{getLocationMessage(weather.location)}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <ThermometerIcon className="w-6 h-6 text-blue-500" />
                                <p>{getTemperatureMessage(weather.temperature, weather.unit)}</p>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                                <CloudIcon className="w-6 h-6 text-blue-500" />
                                <p>{getWeatherData(weather.description)}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            <footer className="mt-8 text-white text-lg font-semibold">
                <p>
                    Made by <span className="text-yellow-300 hover:text-yellow-400">Aaraiz Ali</span>
                </p>
            </footer>
        </div>
    );
}

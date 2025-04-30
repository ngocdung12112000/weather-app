import { useState } from 'react';
import './App.css';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY; // Access the API key from .env
const API_URL = 'https://api.weatherstack.com/current'; // Note: Weatherstack free plan uses HTTP

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeatherData(null); // Clear previous data

    try {
      // Weatherstack API uses 'query' parameter for location
      const response = await fetch(`${API_URL}?access_key=${API_KEY}&query=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (!response.ok || data.error) {
        // Handle API-specific errors and HTTP errors
        throw new Error(data.error?.info || `HTTP error! status: ${response.status}`);
      }

      if (data.current) {
        setWeatherData({
          temperature: `${data.current.temperature}°C`,
          description: data.current.weather_descriptions?.[0] || 'N/A',
          humidity: `${data.current.humidity}%`,
          wind: `${data.current.wind_speed} km/h`, // Weatherstack provides km/h
          icon: data.current.weather_icons?.[0] // URL for the icon
        });
      } else {
         throw new Error("Unexpected API response structure.");
      }

      console.log("API response:", weatherData);

    } catch (e) {
      setError(e.message);
      console.error("Failed to fetch weather data:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Real-Time Weather Tracker HEHE</h1>
      <div className="input-container">
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button onClick={handleFetchWeather} disabled={!city}>
          Get Weather
        </button>
      </div>

      {loading && <p>Loading weather data...</p>}

      {error && <p className="error-message">Error: {error}</p>}

      {weatherData && !loading && !error && (
        <div className="weather-info">
          {/* Weatherstack provides city name in response, use it for consistency */}
          <h2>Weather in {weatherData.locationName || city.charAt(0).toUpperCase() + city.slice(1)}</h2>
          {weatherData.icon && (
            <img
              src={weatherData.icon} // Weatherstack provides full URL
              alt={weatherData.description}
              className="weather-icon"
            />
          )}
          <p>Temperature: {weatherData.temperature}</p>
          <p>Description: {weatherData.description}</p>
          <p>Humidity: {weatherData.humidity}</p>
          <p>Wind: {weatherData.wind}</p>
        </div>
      )}
    </div>
  );
}

export default App;

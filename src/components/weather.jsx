import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Weather() {
  // State for handling weather data, error, loading, and coordinates
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [latitude, setLatitude] = useState('');  // State for user-entered latitude
  const [longitude, setLongitude] = useState(''); // State for user-entered longitude
  const [useManualCoords, setUseManualCoords] = useState(false);  // State to toggle manual input
  const [isCelsius, setIsCelsius] = useState(true);  // State for temperature unit toggle

  // Function to get the user's geolocation (latitude and longitude)
  const getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  };

  // Function to handle the successful retrieval of geolocation
  const handlePositionSuccess = async (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    // If user opts to use manual coordinates, don't fetch weather data
    if (!useManualCoords) {
      fetchWeatherData(lat, lon);
    }
  };

  // Function to handle errors when geolocation is not available
  const handlePositionError = () => {
    setError('Unable to retrieve your location.');
  };

  // Function to fetch weather data based on latitude and longitude
  const fetchWeatherData = async (latitude, longitude) => {
    setLoading(true);
    try {
      const apiKey = '03f5b2168a9b0b0622715f87d8b53aee';  // Your API Key
      const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`);
      
      // Update state with fetched weather data
      setWeatherData({
        temperatureCelsius: response.data.main.temp,  // Save in Celsius
        condition: response.data.weather[0].description,
        humidity: `${response.data.main.humidity}%`,
      });
      setError('');  // Reset error if the request is successful
    } catch (err) {
      setWeatherData(null);  // Reset weather data on error
      setError('Unable to fetch weather data. Please try again later.');
    } finally {
      setLoading(false); // Stop loading spinner after fetching the data
    }
  };

  // Handle form submission if using manual coordinates
  const handleManualSubmit = () => {
    if (!latitude || !longitude) {
      setError('Please enter both latitude and longitude');
    } else {
      fetchWeatherData(latitude, longitude);
    }
  };

  // Handle temperature unit toggle
  const toggleTemperatureUnit = () => {
    setIsCelsius(!isCelsius);
  };

  // Get the user's location when the component mounts (if not using manual input)
  React.useEffect(() => {
    if (!useManualCoords) {
      getGeoLocation();
    }
  }, [useManualCoords]);

  // Convert Celsius to Fahrenheit
  const convertToFahrenheit = (celsius) => {
    return (celsius * 9/5) + 32;
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card" style={{ width: '100%', maxWidth: '29rem', position: 'relative' }}>
        <img 
          src="/images/image 8.avif" 
          alt="Weather icon" 
          className="card-img-top" 
          style={{ height: '380px', objectFit: 'cover' }} 
        />
        <div className="card-body">
          <h5 className="card-title">Weather Application</h5>
          <p className="card-text">Get live weather updates and forecasts.</p>

          {/* Option to manually input latitude and longitude */}
          <div className="mb-3">
            <label className="form-check-label">
              <input 
                type="checkbox" 
                checked={useManualCoords} 
                onChange={() => setUseManualCoords(!useManualCoords)} 
                className="form-check-input"
              />
              Use manual coordinates
            </label>
          </div>

          {useManualCoords ? (
            <div>
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter Latitude"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
              />
              <input
                type="number"
                className="form-control mb-3"
                placeholder="Enter Longitude"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
              />
              <button className="btn btn-outline-dark" onClick={handleManualSubmit}>
                Get Weather
              </button>
            </div>
          ) : null}
        </div>

        {/* Display loading message or weather data */}
        {loading ? (
          <p>Loading weather data...</p>
        ) : (
          <ul className="list-group list-group-flush">
            {weatherData ? (
              <>
                <li className="list-group-item">
                  Current Temperature: 
                  {isCelsius ? `${weatherData.temperatureCelsius}°C` : `${convertToFahrenheit(weatherData.temperatureCelsius)}°F`}
                </li>
                <li className="list-group-item">Condition: {weatherData.condition}</li>
                <li className="list-group-item">Humidity: {weatherData.humidity}</li>
              </>
            ) : error ? (
              <li className="list-group-item text-danger">{error}</li>
            ) : (
              <li className="list-group-item">Please wait while we fetch your weather data.</li>
            )}
          </ul>
        )}
        
        {/* Toggle temperature unit */}
        <div className="card-body" style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="btn btn-outline-dark" onClick={toggleTemperatureUnit}>
            Toggle to {isCelsius ? '°F' : '°C'}
          </button>
          <Link to="/" className="card-link">Back</Link>
        </div>
      </div>
    </div>
  );
}

export default Weather;

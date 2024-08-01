import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSearch } from 'react-icons/fa';
import './Home.css';  // Import the CSS file for styling

const Home = ({ isAuthenticated, addFavorite }) => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('London');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/weather/${city}`);
        setWeather(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchWeather();
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(search);
    setShowSearch(false);
  };

  const handleSearchClick = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="container">
      <div className="taskbar">
        <h1 className='app-heading'>Weathery</h1>
        <div className="search-container">
          <FaSearch className="search-icon" onClick={handleSearchClick} />
          {showSearch && (
            <form onSubmit={handleSearch} className="search-form">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter city"
              />
              <button type="submit">Search</button>
            </form>
          )}
        </div>
      </div>
      <div className="weather-info-container">
        <h2 className="city-name">{city}</h2>
        {weather && (
          <div className="weather-info">
            <p className="temperature">{weather.temperature}°C</p>
            <p className="description">{weather.description}</p>
            {isAuthenticated && (
              <button onClick={() => addFavorite(weather.city, weather.temperature, weather.description)}>Add to Favorites</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

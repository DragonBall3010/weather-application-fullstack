import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Ensure you have react-icons installed
import './Favorites.css'; // Import the CSS file for styling

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Adjust the number of items per page

  useEffect(() => {
    const fetchFavorites = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('User is not authenticated.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/favorites', {
          headers: { Authorization: `${token}` },
        });

        if (response.data.data.length === 0) {
          setError('No favorite cities yet.');
        } else {
          const favoritesData = response.data.data;
          const weatherPromises = favoritesData.map(fav =>
            axios.get(`http://localhost:5000/api/weather/${fav.city}`)
          );

          const weatherResponses = await Promise.all(weatherPromises);
          const detailedFavorites = favoritesData.map((fav, index) => ({
            ...fav,
            details: weatherResponses[index].data
          }));

          setFavorites(detailedFavorites);
        }
      } catch (err) {
        console.error('Error fetching favorites:', err); // Log error details
        if (err.response && err.response.status === 500) {
          setError('Server error. Please try again later.');
        } else {
          setError('Failed to fetch favorite cities.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const deleteFavorite = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('User is not authenticated.');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/favorites/${id}`, {
        headers: { Authorization: `${token}` },
      });

      if (response.status === 200) {
        setFavorites(favorites.filter(fav => fav._id !== id));
        setSuccessMessage('Favorite removed successfully');
        setTimeout(() => {
          setSuccessMessage('');
        }, 3000); // Clear the success message after 3 seconds
      } else {
        setError('Failed to delete favorite.');
      }
    } catch (err) {
      console.error('Error deleting favorite:', err);
      setError('Failed to delete favorite.');
    }
  };

  const indexOfLastFavorite = currentPage * itemsPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - itemsPerPage;
  const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);

  const nextPage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(prevPage => prevPage - 1);
  };

  return (
    <div>
      <h1>Your Favorite Cities</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <>
          <div className="favorites-container">
            {currentFavorites.map((fav) => (
              <div key={fav._id} className="favorite-item">
                <div className="favorite-details">
                  <h2>{fav.city}</h2>
                  {fav.details && (
                    <div className="weather-details">
                      <p>Temperature: {fav.details.temperature}°C</p>
                      <p>Description: {fav.details.description}</p>
                      <p>Rainfall: {fav.details.rainfall} mm</p>
                      <p>Wind Speed: {fav.details.windSpeed} kph</p>
                      <p>Wind Direction: {fav.details.windDirection}</p>
                    </div>
                  )}
                </div>
                <div className="delete-icon-wrapper">
                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteFavorite(fav._id)}
                    title="Remove favorite city"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pagination">
            {currentPage > 1 && (
              <button onClick={prevPage} className="pagination-button">Previous</button>
            )}
            {indexOfLastFavorite < favorites.length && (
              <button onClick={nextPage} className="pagination-button">Next</button>
            )}
          </div>
        </>
      )}
      {successMessage && <p className="success">{successMessage}</p>}
    </div>
  );
};

export default Favorites;

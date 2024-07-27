import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa'; // Ensure you have react-icons installed
import './Favorites.css'; // Import the CSS file for styling

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');

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
        
        if (response.data.msg === 'No favorites found for this user') {
          setError('No favorite cities yet.');
          setFavorites([]);
        } else if (response.data.data && Array.isArray(response.data.data)) {
          setFavorites(response.data.data);
        } else {
          setError('Unexpected data format received.');
        }
      } catch (err) {
        console.error('Error fetching favorites:', err);
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
        setSuccessMessage('Favorite has been succesfully removed');
        setTimeout(()=>{
          setSuccessMessage('');
        }, 1500);
      } else {
        setError('Failed to delete favorite.');
      }
    } catch (err) {
      console.error('Error deleting favorite:', err);
      setError('Failed to delete favorite.');
    }
  };

  return (
    <div>
      <h1>Your Favorite Cities</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className='error'>{error}</p>
      ) : (
        <div className="favorites-container">
          {favorites.map((fav) => (
            <div key={fav._id} className="favorite-item">
              <div className="favorite-details">
                <h2>{fav.city}</h2>
                <p>{fav.temperature}°C - {fav.description}</p>
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
      )}
      {successMessage && <p className='success'>{successMessage}</p>}
    </div>
  );
};

export default Favorites;

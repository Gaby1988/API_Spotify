import React, { useState, useEffect } from 'react';
import axios from 'axios'; // npm install axios


function Spotify() {
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const clientId = `cle id à récupérer sur l'API de Spotify`;
  const clientSecret = `cle secret pareil à récupérer sur l'API de Spotify`;
  const redirectUri = 'http://localhost:5173'; // Serveur React doit-être le même que le serveur React(port)

  // Fonction pour obtenir le token d'accès
  const getAccessToken = () => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      data: 'grant_type=client_credentials',
      method: 'POST',
    })
      .then((response) => {
        setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fonction pour rafraîchir le token d'accès
  const refreshAccessToken = () => {
    axios('https://accounts.spotify.com/api/token', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      data: `grant_type=refresh_token&refresh_token=${refreshToken}`,
      method: 'POST',
    })
      .then((response) => {
        setAccessToken(response.data.access_token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Fonction pour effectuer une recherche
  const search = () => {
    const genres = ['rock', 'jazz', 'pop', 'reggae', 'rap', 'metal', 'salsa', 'tecktonic', 'hardcore', 'zouk', 'electro', 'house']; // Tableau à compléter
    genres.forEach((genre) => {
      axios(`https://api.spotify.com/v1/search?type=track&q=${genre}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      })
        .then((response) => {
          setSearchResults((prevResults) => [...prevResults, response.data]);
        })
        .catch((error) => {
          if (error.response.status === 401) {
            // Le token d'accès a expiré, on rafraîchit le token et on refait la recherche
            refreshAccessToken();
            setTimeout(() => {
              search();
            }, 1000); // On attend 1 seconde avant de relancer la recherche
          } else {
            console.log(error);
          }
        });
    });
  };

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      search();
    }
  }, [accessToken]);

  console.log(searchResults);

  return (
    <div>
      <h1>Search Results:</h1>
    </div>
  );
}

export default Spotify;


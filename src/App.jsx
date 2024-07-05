import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import MovieList from './components/MovieList';
import MovieListHeading from './components/MovieListHeading';
import SearchBox from './components/SearchBox';
import AddFavourite from './components/AddFavourite';
import RemoveFavourites from './components/RemoveFavourites';
import CustomAlert from './components/CustomAlert';

const App = () => {
  const [movies, setMovies] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [alert, setAlert] = useState({ message: '', type: '', visible: false });

  useEffect(() => {
    const getMovieRequest = async (searchValue) => {
      const url = `https://www.omdbapi.com/?s=${searchValue}&apikey=263d22d8`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const responseJson = await response.json();

        if (responseJson.Search) {
          setMovies(responseJson.Search);
        } else {
          setMovies([]);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    getMovieRequest(searchValue);
  }, [searchValue]);

  useEffect(() => {
    const movieFavourites = JSON.parse(localStorage.getItem('react-movie-app-favourites'));

    if (movieFavourites) {
      setFavourites(movieFavourites);
    }
  }, []);

  const saveToLocalStorage = (items) => {
    localStorage.setItem('react-movie-app-favourites', JSON.stringify(items));
  };

  const addFavouriteMovie = (movie) => {
    const isMovieInFavourites = favourites.find((fav) => fav.imdbID === movie.imdbID);

    if (isMovieInFavourites) {
      setAlert({ message: 'This movie is already in your Watchlist!', type: 'warning', visible: true });
      return;
    }

    const newFavouriteList = [...favourites, movie];
    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const removeFavouriteMovie = (movie) => {
    const newFavouriteList = favourites.filter((favourite) => favourite.imdbID !== movie.imdbID);

    setFavourites(newFavouriteList);
    saveToLocalStorage(newFavouriteList);
  };

  const closeAlert = () => {
    setAlert({ ...alert, visible: false });
  };

  return (
    <div className="container-fluid movie-app">
      {alert.visible && <CustomAlert message={alert.message} type={alert.type} onClose={closeAlert} />}
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="Movies" />
        <SearchBox searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <div className="row">
        <MovieList
          movies={movies}
          handleFavouritesClick={addFavouriteMovie}
          favouriteComponent={AddFavourite}
        />
      </div>
      <div className="row d-flex align-items-center mt-4 mb-4">
        <MovieListHeading heading="WatchList" />
      </div>
      <div className="row">
        <MovieList
          movies={favourites}
          handleFavouritesClick={removeFavouriteMovie}
          favouriteComponent={RemoveFavourites}
        />
      </div>
    </div>
  );
};

export default App;

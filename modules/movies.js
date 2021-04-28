'use strict';

let cache = require('./cache.js');

const superagent = require('superagent');

const getMovies = (city) => {
  const key = 'movies-' + city;
  const url = 'https://api.themoviedb.org/3/search/movie';
  const queryParams = {
    api_key: process.env.MOVIE_API_KEY,
    query: city,
  };

  if (cache[key] && (Date.now() - cache[key].timestamp < 50000)) {
    console.log('Cache hit');
  } else {
    console.log('Cache miss');
    cache[key] = {};
    cache[key].timestamp = Date.now();
    cache[key].data = superagent.get(url).query(queryParams)
      .then(response => parseMovies(response.body));
  }

  return cache[key].data;
};

function parseMovies(movieData) {
  try {
    const movieSummaries = movieData.results.map(info => {
      return new CityMovie(info);
    });
    return Promise.resolve(movieSummaries);
  } catch (e) {
    return Promise.reject(e);
  }
}

function CityMovie(info) {
  this.title = info.title;
  this.overview = info.overview;
}

module.exports = getMovies;

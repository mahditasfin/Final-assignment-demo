const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: String,
  plot: String,
  year: Number,
  type: String,
});

const Movie = mongoose.model('Movie', movieSchema, 'movies');

module.exports = Movie;
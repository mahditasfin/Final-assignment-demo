const express = require('express');
const mongoose = require('mongoose');
const Movie = require('./models/movie');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://rocket:MaNbUktrSrISAWg5@search-data.xez1jx2.mongodb.net/movie-data?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });

// Set up middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Define routes
app.get('/', (req, res) => {
  res.render('index', { movies: [] });
});

app.get('/search', async (req, res) => {
  const { query, filter, category, page } = req.query;
  const queryObject = {};

  // Set the default values for pagination
  const limit = 10;
  const currentPage = parseInt(page, 10) || 1;
  const skip = (currentPage - 1) * limit;

  if (query) {
    queryObject[filter] = { $regex: new RegExp(query, 'i') };
  }

  if (category) {
    queryObject.category = category;
  }

  try {
    const count = await Movie.countDocuments(queryObject);
    const totalPages = Math.ceil(count / limit);

    const movies = await Movie.find(queryObject)
      .skip(skip)
      .limit(limit);

    res.render('index', {
      movies,
      currentPage,
      totalPages,
      hasPreviousPage: currentPage > 1,
      hasNextPage: currentPage < totalPages,
      nextPage: currentPage + 1,
      previousPage: currentPage - 1,
      query,
      filter,
      category,
    });
  } catch (err) {
    console.error(err);
    res.render('index', { movies: [] });
  }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
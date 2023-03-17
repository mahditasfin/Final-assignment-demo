const express = require('express');
const mongoose = require('mongoose');
const Sample = require('./models/sample')

const app = express();
// Set up middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));


// Connect to MongoDB
mongoose.connect('mongodb+srv://user:password@database.node.mongodb.net/movie-data?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch((err) => {
    console.error(err);
  });


  // mongoose.connect('url', { useNewUrlParser: true, useUnifiedTopology: true })
  // .then(() => {
  //   console.log('MongoDB connected');
  // })
  // .catch((err) => {
  //   console.error(err);
  // });
// Route to render the movies EJS template
app.get('/', (req, res) => {
  // Find movies with a runtime greater than 120 minutes, limit to 10 documents
  let query = { runtime: 120 }
  
  Sample.find(query)
  .limit(10)
  .then((returnedMovies) => {
    res.render('index',{movies:returnedMovies});

  })
  .catch((err) => {
    console.log(err);
  });
});

app.get('/search', async (req, res) => {
  console.log(req.query)
  const { query, filter, category} = req.query;
  let queryObject = {}
  if(query){
    if (filter === "runtime"){
      console.log("runtime query")
      queryObject = {runtime:query}
    }else if(filter === "title"){
      queryObject = {title: {$regex: new RegExp(query, 'i')}}; 
    }
  }
  
  //res.send(query, filter, category)
  console.log(queryObject)
  Sample.find(queryObject)
  .limit(5)
  .then((returnedMovies) => {
    res.render("index", {movies:returnedMovies})
    //console.log(returnedMovies)
    //res.render('index',{movies:returnedMovies});
  })
})



// app.get('/', (req, res) => {
//   // Find movies with a runtime greater than 120 minutes, limit to 10 documents
//   Sample.find()
//   .then((movies) => {
//     res.render('index',{movies:movies});
//     console.log(movies)
//   })
//   .catch((err) => {
//     console.log(err);
//   });
// });


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});

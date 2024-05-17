const express = require('express');
const ejs = require('ejs');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Environment variable or fallback to local MongoDB
const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';

// Connect to MongoDB
mongoose.connect(MongoDBURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Configure session middleware with MongoStore
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MongoDBURI // Directly use the MongoDB URI
  })
}));

const app = express();

// Set views directory and view engine as ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Use bodyParser middleware for parsing JSON and urlencoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from the 'views' directory
app.use(express.static(__dirname + '/views'));

// Import and use routes from 'index'
const index = require('./routes/index');
app.use('/', index);

// Middleware for handling 404 errors
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error handling middleware for all other types of errors
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// Start the server on the environment's designated port or on 3000 if not specified
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});

const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
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
});

// Correct usage with newer connect-mongo
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: MongoDBURI  // Directly use the MongoDB URI
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

// Assume 'index' is correctly defined in your routes
const index = require('./routes/index');
app.use('/', index);

app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});

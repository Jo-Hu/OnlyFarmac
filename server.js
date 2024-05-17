const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';

// mongoose.connect(MongoDBURI, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// });

mongoose.connect(MongoDBURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Database connection successful');
    // If you need a reference to the database connection
    const db = mongoose.connection;

    // Use db for further operations
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  })
  .catch(err => console.error('Database connection error:', err));

  

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(__dirname + '/views'));

const index = require('./routes/index');
app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen on port 3000
app.listen(process.env.PORT || 3000, () => {
  console.log('Express app listening on port 3000');
});
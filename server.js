const express = require('express');
const ejs = require('ejs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// const MongoDBURI = process.env.MONGO_URI || 'mongodb://localhost/ManualAuth';

// mongoose.connect(MongoDBURI, {
//   useUnifiedTopology: true,
//   useNewUrlParser: true
// }).catch(err => {
//   console.error('Database connection error:', err);
// });
mongoose.connect('mongodb+srv://username:password@your-host.mongodb.net/yourDatabase?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });

const dbURI = 'yourConnectionString';
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Database connected!'))
    .catch(err => console.log('Connection error:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connection successful');
});

app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongoUrl: MongoDBURI,
    collectionName: 'sessions'
  })
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'views')));

const index = require('./routes/index');
app.use('/', index);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send(err.message);
});

// Listen on port 3000
app.listen(port, () => {
  console.log(`Express app listening on port ${port}`);
});

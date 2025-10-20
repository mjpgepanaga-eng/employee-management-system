require('dotenv').config(); // Load environment variables from .env

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var employees = require('./routes/employees');

var app = express();

// ---------------- Parse URL-encoded bodies ----------------
app.use(bodyParser.urlencoded({ extended: false }));

// ---------------- MongoDB (Mongoose) Setup ----------------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// ---------------- Routes ----------------
app.use('/employees', employees);
app.use('/', indexRouter);
app.use('/users', usersRouter);

// ---------------- View Engine Setup ----------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- Error Handling ----------------
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 8000;

// Only start listening if running locally (Vercel handles this automatically)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;

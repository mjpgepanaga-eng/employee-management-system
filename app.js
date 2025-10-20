var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');

var app = express();

// Parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: false }));

// ---------------- Mongoose Setup ----------------
const mongoose = require('mongoose');
var employees = require('./routes/employees');

mongoose.connect("mongodb://localhost:27017/nodecrud")
  .then(() => console.log("Connected to MongoDB (local)"))
  .catch(err => console.error("Connection error:", err));

// ---------------- Routes ----------------
app.use('/employees', employees);

// ---------------- View Engine Setup ----------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// ---------------- Error Handling ----------------
// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

// ---------------- Start Server (Local only) ----------------
const PORT = process.env.PORT || 8000;

// Only start listening if not in Vercel (where it's handled automatically)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;

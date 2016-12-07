var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var mongoStore = require("connect-mongo")(session);
var mongo = require("mongodb").MongoClient;
var bodyParser = require('body-parser');



var index = require('./routes/index');
var users = require('./routes/users');
var signin = require('./routes/signin');
var followup = require('./routes/followup');
var review = require('./routes/review');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', index);
app.use('/users', users);

app.get('/listFollowUps', followup.listFollowUp);
app.get('/listFollowUps/Critical', followup.listCriticalFollowUp);
app.get('/listFollowUps/Total',followup.listFollowUpTotal);
app.get('/listFollowUps/Patient/:patientId', followup.listFollowUpByPatient);
app.get('/listFollowUps/Review',review.listFollowUpForReview);
app.get('/listFollowUps/Review/Critical',review.listFollowUpForCriticalReview);
app.get('/listFollowUps/Review/Total',review.listFollowUpTotalForReview);
app.get('/listFollowUps/Review/Patient/:patientId',review.listReviewedFollowupByPatient);
app.get('/notes/count/:userId',signin.noOfNotes);

app.post('/signin', signin.authenticateUser);
app.post('/addDoctor', signin.addDoctor);
app.post('/addPatient', signin.addPatient);
app.post('/submitFollowup', followup.submitFollowup);
app.post('/scheduleFollowup', followup.scheduleFollowup);
app.post('/submitReview',review.submitReview);
app.post('/sendNote', review.sendNote);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
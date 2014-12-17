var bodyParser = require('body-parser');
var express = require('express');
var app = express();

// Database reference is stored in global.db

// Static directories
app.use(express.static('public', { index: false }));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap/dist'));
app.use(express.static('node_modules/jquery/dist/cdn'));

// Middleware
app.use(bodyParser.json());

// Authentication
app.use('/login', require('./controllers/login'));
app.use(function(req, res, next) {
  if(!global.db) return res.redirect('/login');
  next();
});

// API routes
app.use('/db', require('./controllers/db'));
app.use('/collection', require('./controllers/collection'));

// Angular app
app.get('*', function mainAppRequest(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

// Start the server
app.listen(3000, function(callback) {
  console.log("App listening on localhost:3000");
});

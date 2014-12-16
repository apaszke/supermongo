var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;

// GLOBAL DATABASE REFERENCE
var db;

app.use(express.static('public', { index: false }));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap/dist'));

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/connect', function (req, res) {
  MongoClient.connect(url, function(err, dbobj) {
    console.log("Connected correctly to server");
    db = dbobj;
  });
});

app.get('*', function(req, res) {
  if (db) {
    res.sendFile(__dirname + '/public/index.html');
  } else {
    res.redirect('/login');
  }
});

app.listen(3000, function(callback) {
  console.log("App listening on localhost:3000");
});

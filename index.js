var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var _ = require('lodash');

// GLOBAL DATABASE REFERENCE
var db;

// STATIC FILES
app.use(express.static('public', { index: false }));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap/dist'));

// MIDDLEWARE
app.use(bodyParser.json());

// LOGIN
app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.post('/connect', function(req, res) {
  var url = constructMongoUrl(req.body);
  console.log(url);
  MongoClient.connect(url, function(err, dbobj) {
    if(err) {
      res.json({ error: 1, message: "Couldn't connect to database"});
      return;
    }
    db = dbobj;
    res.json({ ok: true })
  });
});

app.use(function(req, res, next) {
  if(!db) {
    res.redirect('/login');
    return;
  }
  next();
});


// APP ROUTES
app.get('/db', function(req, res) {
  db.collectionNames(function(err, collections) {
    var names = _(collections)
      .map(function(item) {
        return item.name.slice(db.databaseName.length + 1);
      })
      .value();
    res.json({ collections: names });
  });
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, function(callback) {
  console.log("App listening on localhost:3000");
});

function constructMongoUrl(params) {
  var protocol = 'mongodb://';
  var address = params.address || '127.0.0.1';
  var port = params.port || '27017';
  var database = params.database || 'test';
  var credentials = '';
  if(params.username) {
    credentials = params.username;
    credentials += params.password ? (':'+params.password) : '';
    credentials += '@';
  }
  return protocol + credentials + address + ':' + port + '/' + database;
}

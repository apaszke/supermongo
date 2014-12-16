var express = require('express');
var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules/angular'));
app.use(express.static('node_modules/angular-route'));
app.use(express.static('node_modules/bootstrap/dist'));

app.get('/login', function(req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('*', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000, function(callback) {
  console.log("App listening on localhost:3000");
});

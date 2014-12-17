var MongoClient = require('mongodb').MongoClient;
var express = require('express');
var router = express.Router();

/**
 * All routes are mounted under /login
 */

router.get('/', function loginRoute(req, res) {
  res.sendFile(process.cwd() + '/public/login.html');
});

router.post('/', function connectToDatabaseRoute(req, res) {
  var url = constructMongoUrl(req.body);
  MongoClient.connect(url, function handleDatabaseConnection(err, dbobj) {
    if(err) {
      return res.json({ error: 1, message: "Couldn't connect to database"});
    }
    global.db = dbobj;
    res.json({ ok: 1 });
    console.log("Connected to database: " + db.databaseName);
  });
});

module.exports = router;

/**
 * Helpers
 */

/**
 * Takes request params and constructs a mongo url for connection
 * Valid param fields are: address, port, database, user and password
 *
 * @param  {object} params POST request parameters
 * @return {string} 
 */
function constructMongoUrl(params) {
  var protocol = 'mongodb://';
  var address = params.address || '127.0.0.1';
  var port = params.port || '27017';
  var database = params.database || 'test';
  var credentials = '';
  if(params.user) {
    credentials = params.user;
    credentials += params.password ? (':'+params.password) : '';
    credentials += '@';
  }
  return protocol + credentials + address + ':' + port + '/' + database;
}

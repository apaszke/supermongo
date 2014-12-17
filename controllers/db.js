var express = require('express');
var router = express.Router();
var _ = require('lodash');

router.get('/collections/names', function(req, res) {
  db.collectionNames(function(err, names) {
    if(err) return res.json({error: 2, message: "Couldn't retrieve collections"});
    var dbNameLength = db.databaseName.length;
    // Strip unnecesarry objects and remove database name
    var names = _(names)
      .map(function(item) {
        return item.name.slice(dbNameLength + 1);
      })
      .value();
    res.json({ collections: names});
  });
});

router.get('/collections/stats', function(req, res) {
  db.collections(function(err, collections) {
    if(err) return res.json({error: 2, message: "Couldn't retrieve collections"});

  });
});

router.get('/stats', function (req, res) {
  db.stats(function(err, stats) {
    if(err) return res.json({error: 2, message: "Couldn't retrieve stats"});
    res.json(stats);
  });
});

module.exports = router;

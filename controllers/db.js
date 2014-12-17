var express = require('express');
var router = express.Router();
var async = require('async');
var _ = require('lodash');

/**
 * All routes are mounted under /db
 */

router.get('/collections/names', function(req, res) {
  db.collectionNames(function(err, names) {
    if(err) return res.json({error: 2, message: "Couldn't retrieve collections"});

    var dbNameLength = db.databaseName.length;
    // Strip unnecesarry objects and remove database name
    var names = _(names)
      .map(function(item) { return item.name.slice(dbNameLength + 1); })
      .value();

    res.json({ collections: names });
  });
});

router.get('/collections/stats', function(req, res) {
  db.collections(function(err, collections) {
    if(err) return res.json({ error: 2, message: "Couldn't retrieve collections" });

    async.map(collections, mapCollectionStats, function(err, stats) {
      // Map stats to object with collection names as keys
      var results = {};
      var dbNameLength = db.databaseName.length;
      stats.forEach(function(item) {
        var name = item.ns.slice(dbNameLength + 1);
        results[name] = item;
      });

      res.json(results);
    });
  });
});

router.get('/collections/samples', function(req, res) {
  db.collections(function(err, collections) {
    if(err) return res.json({ error: 2, message: "Couldn't retrieve collections" });

    async.map(collections, mapCollectionSample, function(err, samples) {
      // Map samples to object with collection names as keys
      var results = {};
      samples.forEach(function(item) {
        results[item.name] = item.docs;
      });

      res.json(results);
    });
  });
});

router.get('/stats', function (req, res) {
  db.stats(function(err, stats) {
    if(err) return res.json({error: 2, message: "Couldn't retrieve database stats"});

    res.json(stats);
  });
});

module.exports = router;

/*
 *  Helpers
 */

/**
 * Gathers stats for collection
 * Returns objects with error messages
 * instead of passing them into callback's first argument
 *
 * @param {Collection} collection
 * @param {Function}   callback
 */
function mapCollectionStats(collection, callback) {
  collection.stats(function(err, stats) {
    if (err) {
      return callback(null, {
        error: 2,
        message: "Couldn't retrieve stats"
      });
    }

    callback(null, stats);
  });
}

/**
 * Finds sample documents in collection
 * Returns objects with error messages
 * instead of passing them into callback's first argument
 *
 * @param {Collection} collection
 * @param {Function}   callback
 */
function mapCollectionSample(collection, callback) {
  collection.find({}, { limit: 5 }).toArray(function(err, docs) {
    if (err) {
      return callback(null, {
        error: 2,
        message: "Couldn't retrieve documents"
      });
    }

    callback(null, { name: collection.collectionName, docs: docs });
  });
}

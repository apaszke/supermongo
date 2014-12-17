var express = require('express');
var router = express.Router();

/**
 * All routes are mounted under /collection/
 */

router.get('/:name', function(req, res) {
  res.send(req.params.name);
});

module.exports = router;

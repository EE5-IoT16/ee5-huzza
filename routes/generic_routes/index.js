var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile('index.html', {root: './views'});
});

router.post('/', function(req, res, next) {
  res.sendFile('index.html', {root: './views'});
});

router.put('/', function(req, res, next) {
  res.sendFile('index.html', {root: './views'});
});

router.delete('/', function(req, res, next) {
  res.sendFile('index.html', {root: './views'});
});

module.exports = router;

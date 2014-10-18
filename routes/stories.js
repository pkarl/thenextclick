var fs = require('fs')
var express = require('express');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send({
		'foo': 'to the bar'
	});
});

/* get ANY story */
router.get('/random', function(req, res) {

	fs.readFile(__dirname + '/../public/data/stories.json', 'utf8', function(err, data) {
		if (err) { return console.log(err); }

		var stories = JSON.parse(data);

		res.send(stories.results[Math.floor(Math.random()*stories.results.length)]);
	});

});

module.exports = router;
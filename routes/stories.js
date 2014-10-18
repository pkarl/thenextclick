var fs = require('fs')
var express = require('express');
var moment = require('moment');
var _ = require('lodash');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.send({
		'foo': 'to the bar'
	});
});

function mapToNiceness(rawStory) {

	// headline
	// byline (type of staff/source)
	// abstract / summary
	// media?? first photo maybe?
	// timestamp
	// facets
	
	story = {
		headline: rawStory.title,
		byline: rawStory.byline,
		summary: rawStory.abstract,
		timestamp: moment(rawStory.created_date).format('MMM Do YYYY, h:mm:ss a')
	};

	var facets = {
		"descriptive": rawStory.des_facet,
		"organizational": rawStory.org_facet,
		"people": rawStory.per_facet
	};

	story.thumb = rawStory.thumbnail_standard;
	story.photo = rawStory.multimedia[3];

	return story;
}

/* get ANY story */
router.get('/random', function(req, res) {

	fs.readFile(__dirname + '/../public/data/stories.json', 'utf8', function(err, data) {
		if (err) { return console.log(err); }

		var stories = JSON.parse(data);
		var randomStory = stories.results[Math.floor(Math.random()*stories.results.length)];

		res.send( mapToNiceness(randomStory) );
	});

});

module.exports = router;
var fs = require('fs')
var express = require('express');
var moment = require('moment');
var _ = require('lodash');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.send({
		'foo': 'to the bar'
	});
});

router.get('/find', function(req, res) {

	res.setHeader("Access-Control-Allow-Origin", "*");

	fs.readFile(__dirname + '/../public/data/stories.json', 'utf8', function(err, data) {
		if (err) { return console.log(err); }
		var title = req.param("title");
		var stories = JSON.parse(data).results;
		var story_found = false;
		_.each(stories, function(story){
			if (story.title === title){
				res.send( mapToNiceness(story) );
				story_found = true;
			}
		})
		if (!story_found) {
			res.send({"error": "No story is found."});
		}
	});
});

/* get ANY story */
router.get('/random', function(req, res) {

	res.setHeader("Access-Control-Allow-Origin", "*");

	// if the request contains a "channel", use that. Otherwise, use stories.
	var source = req.param("channel") ? req.param("channel") : 'stories';

	fs.readFile(__dirname + '/../public/data/' + source + '.json', 'utf8', function(err, data) {
		if (err) { return console.log(err); }

		var stories = JSON.parse(data);
		var randomStory = stories.results[Math.floor(Math.random()*stories.results.length)];

		res.send( mapToNiceness(randomStory) );
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
	if(rawStory.hasOwnProperty('multimedia')) {
		if(rawStory.multimedia.length > 2) {
			story.photo = rawStory.multimedia[3].url;
		}
	} else if(rawStory.hasOwnProperty('media')) {
		if (rawStory.media[0] && rawStory.media[0]['media-metadata'] && (rawStory.media[0]['media-metadata'].length > 1) ) {
			story.photo = rawStory.media[0]['media-metadata'][2].url;
		}
	}

	return story;
}


module.exports = router;

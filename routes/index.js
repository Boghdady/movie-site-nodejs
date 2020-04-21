var express = require('express');
const request = require('request');
var router = express.Router();

const apiKey = '1fb720b97cc13e580c2c35e1138f90f8';
const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

// Middleware to make imageBaseUrl avaliable in all veiws
router.use((req, res, next) => {
	res.locals.imageBaseUrl = imageBaseUrl;
	next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
	request(nowPlayingUrl, (error, response, body) => {
		if (response.statusCode == 200) {
			const movieDataObject = JSON.parse(response.body);
			res.render('index', {
				moviesList: movieDataObject.results
			});
		} else {
			res.render('error');
		}
	});
});

// Single Movie
router.get('/movie/:id', (req, res, next) => {
	const movieId = req.params.id;
	const movieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;

	// Doing http request to get movie details using it's id
	request(movieUrl, (err, response, body) => {
		if (response.statusCode == 200) {
			const movieDetailsObject = JSON.parse(response.body);
			res.render('single-movie', { movieDetailsObject });
		} else {
			res.render('error');
		}
	});
});

// Search
router.post('/search', (req, res, next) => {
	const userSearchTerm = encodeURI(req.body.movieSearch);
	const cat = req.body.cat;
	const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;

	request(movieUrl, (err, response, body) => {
		const parsedData = JSON.parse(body);

		if (cat == 'person') {
			parsedData.results = parsedData.results[0].known_for;
		}

		res.render('index', {
			moviesList: parsedData.results
		});
	});
});

module.exports = router;

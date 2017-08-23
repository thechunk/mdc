var assert = require('assert');
var Promise = require('bluebird');
var googlePlaces = new require('googleplaces')('***REMOVED***', 'json');

function recursiveGooglelaceSearch(queries, results, res, rej) {
	assert(Array.isArray(queries));

	if (!queries.length) res(results);
	if (results == null) results = [];

	googlePlaces.textSearch({
		query: queries.join(' '),
	}, function(err, resp) {
		queries.pop();
		if (err == null && !resp.hasOwnProperty('error_message')) recursiveGooglePlaceSearch(queries, results.concat(resp.results), res, rej);
		else rej(err || resp);
	});
}

function googlePlaceSearch(queries, results) {
	return new Promise(function(resolve, reject) {
		recursiveGooglePlaceSearch(queries, results, resolve, reject);
	});
}

module.exports = {
	// TODO: this doesn't work well because of API limit
	// /api/v1/lookup/place/?kw=<keyword>
	placesSearch: function(req, res) {
		var keyword = req.query.kw;
		var addr = req.query.addr;
		var phone = req.query.phone;

		assert(keyword && !!keyword.length)

		var queryList = [keyword, addr, phone];

		googlePlaceSearch(queryList)
			.then(function(resp) {
				res.send(resp);
			})
			.catch(function(err) {
				res.send(err)
			})
	}
};

var angular = require('angular');
var Promise = require('bluebird');
var GoogleMapsLoader = require('google-maps');

angular.module('app.svc.sourcer', [])
	.service('SourcerSvc', ['$q', '$rootScope', function($q, $rootScope) {
		this.scanning = false;
		this.placesSvc = null;

		function recursiveGooglePlaceSearch(queries, addedIds, results, res, rej) {
			if (!queries.length) return res(results);
			if (results == null) results = [];
			if (addedIds == null) addedIds = [];

			this.placesSvc.textSearch({
				query: queries.join(' '),
			}, function(resp, err) {
				queries.pop();
				for (var i = 0; i < resp.length; i++) {
					var result = resp[i];
					if (addedIds.indexOf(result.place_id) === -1) {
						addedIds.push(result.place_id);
						results.push(result)
					}
				}
				if (err == 'OK' || (err == 'ZERO_RESULTS' && !!queries.length)) recursiveGooglePlaceSearch(queries, addedIds, results, res, rej);
				else return rej(err);
			});
		}

		function googlePlaceSearch(queries) {
			return new Promise(function(resolve, reject) {
				$rootScope.$broadcast('app.svc.cleaner.search.start');
				recursiveGooglePlaceSearch(queries, null, null, resolve, reject);
			});
		}

		this.googlePlaceDetail = function(merchant, placeId) {
			return new Promise(function(resolve, reject) {
				this.placesSvc.getDetails({
					placeId: placeId
				}, function(data, status) {
					if (status === 'OK') resolve({
						merchant: merchant,
						results: data
					});
					else reject(data);
				});
			});
		}

		this.search = function(asyncStartedCb, merchant, keyword, address, phone) {
			return new Promise(function(resolve, reject) {
				this.scanning = true;
				$rootScope.$broadcast('app.svc.cleaner.search.init');

				if (asyncStartedCb != null) asyncStartedCb();

				GoogleMapsLoader.LIBRARIES = ['places'];
				GoogleMapsLoader.load(function(google) {
					this.placesSvc = new google.maps.places.PlacesService(document.createElement('div'));
					googlePlaceSearch([keyword, address, phone])
						.then(function(resp) {
							this.scanning = false;
							var data = {
								merchant: merchant,
								results: resp
							}
							$rootScope.$broadcast('app.svc.cleaner.search.success', data);
							resolve(data);
						})
						.catch(function(err) {
							this.scanning = false;
							$rootScope.$broadcast('app.svc.cleaner.search.error', err);
							reject(err)
						});
				});
			}.bind(this));
		}

		this.isScanning = function() {
			return this.scanning;
		}
	}])

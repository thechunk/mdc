var angular = require('angular');
var stringSimilarity = require('string-similarity');
var merchantSvc = require('./merchant');
var sourcerSvc = require('./sourcer');
var sessionSvc = require('./session');

angular.module('app.svc.compare', ['app.svc.merchant', 'app.svc.sourcer'])
	.service('CompareSvc', ['MerchantSvc', 'SourcerSvc', 'SessionSvc', '$rootScope', '$timeout', function(MerchantSvc, SourcerSvc, SessionSvc, $rootScope, $timeout) {
		this.running = false;
		this.fields = [{
			merchantField: 'name',
			sourceField: 'name',
			threshold: 0.8
		}, {
			merchantField: 'address',
			sourceField: 'formatted_address',
			threshold: 0.6
		}, {
			merchantField: 'phone',
			sourceField: 'formatted_phone_number',
			threshold: 0.8
		}];

		// 
		this.compare = function() {
			this.running = true;
			$rootScope.$broadcast('app.svc.compare.compare.start');

			return new Promise(function(res, rej) {
				this.consolidateSources()
					.then(function(data) {
						var consolidatedData = data;
						var promises = [];
						var count = 0;
						for (var merchantId in data) {
							var merchant = data[merchantId].merchant;
							var source = data[merchantId].source;
							var drillSource = null;
							promises.push(new Promise(function(resolve, reject) {
								(function(m, s) {
									$timeout(function() {
										SourcerSvc.googlePlaceDetail(m, s[0].place_id)
											.then(resolve)
											.catch(reject);
									}, 2000 * count);
								}.bind(this))(merchant, source);
							}.bind(this)));
							count++;
						}
						Promise.all(promises)
							.then(function(allData) {
								for (var i = 0; i < allData.length; i++) {
									var merchant = allData[i].merchant;
									var results = allData[i].results;
									consolidatedData[merchant.id].detail = results;
									consolidatedData[merchant.id].fields = this.matchFields(merchant, results);
								}
								this.running = false;
								$rootScope.$broadcast('app.svc.compare.compare.success', consolidatedData);
								$rootScope.$apply();
								res(consolidatedData);
							}.bind(this))
							.catch(rej);
					}.bind(this))
					.catch(function(err) {
						this.running = false;
						console.log(err);
						$rootScope.$broadcast('app.svc.compare.compare.error', err);
						$rootScope.$apply();
					});
			}.bind(this));
		}

		// String matching on one Merchant + Source item
		this.matchFields = function(merchant, source) {
			var matchResult = {};
			for (var i = 0; i < this.fields.length; i++) {
				var fields = this.fields[i];
				var score = stringSimilarity.compareTwoStrings(
					merchant[fields.merchantField],
					source[fields.sourceField]
				);
				matchResult[fields.merchantField] = {
					score: score,
					pass: fields.threshold < score
				};
			}
			return matchResult;
		}

		// Consolidate all Merchant and Source data
		this.consolidateSources = function() {
			var mappedComparison = {};
			return new Promise(function(res, rej) {
				MerchantSvc.getMerchants()
					.then(function(merchantData) {
						var promises = [];
						for (var i = 0; i < merchantData.length; i++) {
							var merchant = merchantData[i];
							promises.push(new Promise(function(resolve, reject) {
								(function(m) {
									$timeout(function() {
										SourcerSvc.search(
											null, m, m.name,
											m.address,
											m.phone
										)
											.then(resolve)
											.catch(reject);
									}.bind(this), 2000 * i);
								})(merchant);
							}));
						}
						Promise.all(promises)
							.then(function(data) {
								for (var i = 0; i < data.length; i++) {
									var mId = data[i].merchant.id;
									mappedComparison[mId] = {};
									mappedComparison[mId]['merchant'] = data[i].merchant;
									mappedComparison[mId]['source'] = data[i].results;
								}
								res(mappedComparison);
							})
							.catch(rej);
					});
			});
		}

		this.isRunning = function() {
			return this.running;
		};
	}]);

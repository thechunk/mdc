var angular = require('angular');

angular.module('app.svc.session', [])
	.service('SessionSvc', ['$rootScope', function($rootScope) {
		this.compareData = {};

		$rootScope.$on('app.svc.compare.compare.success', function(e, data) {
			this.compareData = data;
		}.bind(this));

		this.getCompareData = function() {
			return this.compareData;
		};

		this.clearSession = function() {
			this.compareData = {};
		};
	}]);

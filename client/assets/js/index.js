require('material-design-lite/material')
var angular = require('angular');
var ngRoute = require('angular-route');
var wizardIndexCtrl = require('./ctrl/wizard/index');
var wizardStatusCtrl = require('./ctrl/wizard/status');
var wizardResultsCtrl = require('./ctrl/wizard/results');
var wizardMerchantCtrl = require('./ctrl/wizard/merchant');

angular.module('app.index', ['ngRoute', 'app.ctrl.wizard.index', 'app.ctrl.wizard.status', 'app.ctrl.wizard.results', 'app.ctrl.wizard.merchant'])
	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/wizard', {
				templateUrl: '/views/wizard/index.html',
				controller: 'WizardIndexCtrl'
			})
			.when('/wizard/results', {
				templateUrl: '/views/wizard/results.html',
				controller: 'WizardResultsCtrl'
			})
			.when('/wizard/results/:merchantId', {
				templateUrl: '/views/wizard/merchant.html',
				controller: 'WizardMerchantCtrl'
			})
			.otherwise({
				redirectTo: '/wizard'
			})
	}]);

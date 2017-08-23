var angular = require('angular');
var sessionSvc = require('../../svc/session');
var compareSvc = require('../../svc/compare');

angular.module('app.ctrl.wizard.status', ['app.svc.compare', 'app.svc.session'])
	.controller('WizardStatusCtrl', ['$scope', '$location', '$timeout', 'CompareSvc', function($scope, $location, $timeout, CompareSvc) {
		$scope.$on('app.svc.compare.compare.success', function(e, data) {
			console.log(data);
		});
		$scope.$on('app.svc.compare.compare.error', function(e, data) {
			console.log(data);
		});
	}]);

var angular = require('angular');

angular.module('app.ctrl.wizard.results', [])
	.controller('WizardResultsCtrl', ['$scope', '$location', 'SessionSvc', function($scope, $location, SessionSvc) {
		$scope.compareData = SessionSvc.getCompareData();
		console.log($scope.compareData);
	}]);

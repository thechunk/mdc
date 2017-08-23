var angular = require('angular');

angular.module('app.ctrl.wizard.results', [])
	.controller('WizardResultsCtrl', ['$scope', '$location', 'SessionSvc', function($scope, $location, SessionSvc) {
		$scope.showOnlyFailed = false;
		$scope.compareData = SessionSvc.getCompareData();
		$scope.emptyData = angular.equals($scope.compareData, {});
		$scope.resultPasses = function(fields) {
			var pass = true;
			for (var k in fields) {
				if (!fields[k].pass) {
					pass = false;
					break;
				}
			}
			return pass ? 'pass' : 'fail';
		};
	}]);

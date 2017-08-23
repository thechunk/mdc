var angular = require('angular');
var compareSvc = require('../../svc/compare');

angular.module('app.ctrl.wizard.index', ['app.svc.compare'])
	.controller('WizardIndexCtrl', ['$scope', '$location', 'CompareSvc', function($scope, $location, CompareSvc) {
		$scope.running = CompareSvc.isRunning();

		$scope.$on('app.svc.compare.compare.start', function(e, data) {
			$scope.running = CompareSvc.isRunning();
		});
		$scope.$on('app.svc.compare.compare.success', function(e, data) {
			$scope.running = CompareSvc.isRunning();
			$location.path('/wizard/results');
		});
		$scope.$on('app.svc.compare.compare.error', function(e, data) {
			$scope.running = CompareSvc.isRunning();
		});

		$scope.next = function() {
			CompareSvc.compare()
				.catch(function(err) {
					$scope.running = false;
					alert(err);
				});
		}
	}]);

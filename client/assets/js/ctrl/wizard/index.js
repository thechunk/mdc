var angular = require('angular');

angular.module('app.ctrl.wizard.index', [])
	.controller('WizardIndexCtrl', ['$scope', '$location', function($scope, $location) {
		$scope.next = function() {
			$location.path('/wizard/status');
		}
	}]);

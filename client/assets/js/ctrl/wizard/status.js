var angular = require('angular');

angular.module('app.ctrl.wizard.status', [])
	.controller('WizardStatusCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
		$timeout(function() {
			$location.path('/wizard/results');
		}, 4000)
	}]);

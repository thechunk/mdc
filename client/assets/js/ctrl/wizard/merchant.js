var angular = require('angular');

angular.module('app.ctrl.wizard.merchant', [])
	.controller('WizardMerchantCtrl', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
		$scope.merchantId = $routeParams.merchantId;
	}]);

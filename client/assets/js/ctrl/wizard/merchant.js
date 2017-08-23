var angular = require('angular');

angular.module('app.ctrl.wizard.merchant', [])
	.controller('WizardMerchantCtrl', ['$scope', '$routeParams', '$location', 'SessionSvc', function($scope, $routeParams, $location, SessionSvc) {
		var merchantId = $routeParams.merchantId;
		var compareData = SessionSvc.getCompareData();
		$scope.emptyData = angular.equals(compareData, {});
		$scope.merchantData = compareData[merchantId];
	}]);

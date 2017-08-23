var angular = require('angular');
var Promise = require('bluebird');

angular.module('app.svc.merchant', [])
	.service('MerchantSvc', ['$q', function($q) {
		this.getMerchants = function() {
			var merchants = [{
				id: 1,
				name: 'Zambo Restaurant',
				address: '4-5/355 Crown St, Surry Hills NSW 2010, Australia',
				phone: '(02) 8937 3599',
				email: '',
				website: ''
			}, {
				id: 2,
				name: 'Silvereye',
				address: '20 Broadway, Chippendale NSW 2008, Australia',
				phone: '(02) 8277 8277',
				email: '',
				website: ''
			}]
			return new Promise(function(resolve, reject) {
				resolve(merchants);
			});
		}
	}]);

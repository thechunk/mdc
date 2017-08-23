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
				website: 'www.google.com'
			}, {
				id: 2,
				name: 'Silvereye',
				address: '20 Broadway, Chippendale NSW 2008, Australia',
				phone: '(02) 8277 8277',
				email: '',
				website: ''
			}, {
				id: 3,
				name: 'Steersons Steakhouse',
				address: 'King Street Wharf, 17 Lime Street, Sydney NSW 2000, Australia',
				phone: '(02) 9295 5060',
				email: '',
				website: ''
			}, {
				id: 4,
				name: 'The Malaya',
				address: '39 Lime St, Sydney NSW 2000, Australia',
				phone: '(02) 9279 1170',
				email: '',
				website: ''
			}, {
				id: 5,
				name: 'Casa Ristorante Italiano',
				address: '42/48 The Promenade, Sydney NSW 2000, Australia',
				phone: '(02) 9279 4115',
				email: '',
				website: ''
			}, {
				id: 6,
				name: 'Meat District Co',
				address: 'R3/11 Lime St, Sydney NSW 2000, Australia',
				phone: '(02) 9299 9762',
				email: '',
				website: ''
			}, {
				id: 7,
				name: 'Belles Hot Chicken',
				address: '33 Barangaroo Avenue, Sydney NSW 2000, Australia',
				phone: '(02) 8355 7879',
				email: '',
				website: ''
			}, {
				id: 8,
				name: 'Spiced by Billu\'s',
				address: 'Shop 7, 7/33 Barangaroo Avenue, Barangaroo NSW 2000, Australia',
				phone: '',
				email: '',
				website: ''
			}, {
				id: 9,
				name: 'Vessel Dining & Bar',
				address: '1 Shelley St, Sydney NSW 2000, Australia',
				phone: '(02) 9299 9999',
				email: '',
				website: ''
			}]
			return new Promise(function(resolve, reject) {
				resolve(merchants);
			});
		}
	}]);

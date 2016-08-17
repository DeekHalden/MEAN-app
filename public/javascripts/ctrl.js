'use strict';
angular.module('flapperNews')
	.factory('items', ['$http','auth', function($http,auth){
		var item = {
			items:[]
		};
		
		item.getAll = () => $http.get('items').success(function(data) {
			angular.copy(data, item.items);
		});

		item.create = (item) => $http.post('/items', item, {
			headers: { Authorization: 'Bearer ' + auth.getToken() }
		}).success(function(data) {
            o.items.push(data);
        });		
	
}])
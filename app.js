angular.module('esriApp', ['ngRoute']);


angular.module('esriApp').config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/', {
			controller: 'MapCntl',
			templateUrl: '/views/mapTemplate.html'
		});
}]);


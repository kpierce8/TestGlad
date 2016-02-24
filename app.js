angular.module('esriApp', ['ngRoute']);


angular.module('esriApp').config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/secret', {
			controller: 'MapCntl',
			templateUrl: '/views/mapTemplate.html'
		})
	.when('/', {templateUrl: '/views/intro.html'});
	
}]);


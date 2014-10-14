angular
	.module( APPNAME )
	.controller('AppController', ['$rootScope', '$scope', function($rootScope, $scope)
	{
		$rootScope.open = false;
		$rootScope.openSide = 'options';
		$rootScope.options = {};
	}]);
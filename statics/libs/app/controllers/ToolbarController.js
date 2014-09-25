angular
	.module('myApp')
	.controller('ToolbarController',
		function($scope, $state){

			console.log($state);
			console.log($state.$current);
			console.log($state.current);
			$scope.state = 'options';
		}
	);
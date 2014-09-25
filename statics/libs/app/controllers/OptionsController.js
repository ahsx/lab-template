angular
	.module('myApp')
	.controller('OptionsController', 
		function($scope)
		{
			$scope.name = 'Hello';
			$scope.value = 12;

			$scope.add = function()
			{
				$scope.value = $scope.value + 1;
			}
		}
	)
;
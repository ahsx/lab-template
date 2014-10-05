angular
	.module( APPNAME )
	.controller('ScreenPlayController', 
		function( $scope, $element, Options )
		{
			if ( Options.scope == null )
				Options.scope = $scope;
			else
				$scope = Options.scope;

			$scope.$watch('quantity', function()
			{
				console.log('change');
			})

			console.log('ScreenPlayController');
			console.log(Options);
		}
	);
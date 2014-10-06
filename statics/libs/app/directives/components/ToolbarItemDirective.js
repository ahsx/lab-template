angular
	.module( APPNAME )
	.directive('toolbaritem', ['$rootScope', function($rootScope){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: true, // {} = isolate, true = child, false/undefined = no change
			controller: function($scope, $element, $attrs, $transclude) 
			{
				$scope.active = false;
				$scope.href = $attrs.href;
				$scope.title = $attrs.title;
				$scope.icon = $attrs.icon;

				$scope.itemClick = function( $event, side )
				{
					$event.preventDefault();

					var side = side.substr(1);
					console.log(side);

					if ( side == $scope.openSlide )
					{
						$rootScope.open = !$rootScope.open;
					}
					else
					{
						$rootScope.open = true;
						$rootScope.openSlide = side;
					}
				}
			},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: getPartial('directives/toolbar-item.html'),
			replace: true,
			transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			link: function($scope, iElm, iAttrs, controller) {
				
			}
		};
	}]);
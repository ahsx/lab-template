angular
	.module( APPNAME )
	.directive('range', [function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: true, // {} = isolate, true = child, false/undefined = no change
			controller:
				function($scope, $element, $attrs, $transclude) 
				{
					$scope.min = ($attrs.min | 0 ) || 0;
					$scope.max = ($attrs.max | 0 ) || 10;
					$scope.value = ($attrs.value | 0 )|| 0;
					$scope.title = $attrs.title;

					$scope.plus = function()
					{
						var n = ($scope.value | 0) + 1;
						$scope.value = Math.min( n, $attrs.max );
					}

					$scope.minus = function()
					{
						var n = ($scope.value | 0) - 1;
						$scope.value = Math.max( n, $attrs.min );
					}
				},
			require: '^', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: '/statics/partials/directives/range.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			// link: function($scope, iElm, iAttrs, controller) {
				
			// }
		};
	}]);
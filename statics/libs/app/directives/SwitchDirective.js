angular
	.module('myApp')
	.directive('switch', [function(){
		// Runs during compile
		return {
			// name: '',
			// priority: 1,
			// terminal: true,
			scope: {}, // {} = isolate, true = child, false/undefined = no change
			controller: 
				function($scope, $element, $attrs, $transclude) 
				{
					$scope.title = $attrs.title;
					$scope.labelOn = $attrs.labelon; // labelon instead of labelOn because always arrive as minuscule
					$scope.labelOff = $attrs.labeloff; // same as above
					$scope.isOn = $attrs.on || false;
				},
			// require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			// template: '',
			templateUrl: '/statics/parts/switch.html',
			// replace: true,
			// transclude: true,
			// compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
			// link: function($scope, iElm, iAttrs, controller) {
			// }
		};
	}]);
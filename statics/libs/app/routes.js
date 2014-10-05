"use strict";

angular
	.module( APPNAME )
	.config(function($stateProvider, $urlRouterProvider) {

		$urlRouterProvider.otherwise("/options");

		$stateProvider
			.state('options', {
				name: 'options',
				url: '/options',
				templateUrl: '/statics/partials/views/optionsbar/options.html'
			})

			.state('about', {
				name: 'about',
				url: '/about',
				templateUrl: '/statics/partials/views/optionsbar/about.html'
			})
	});
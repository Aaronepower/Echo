(function() {
	'use strict';
	angular.module('Intercom')
		   .directive('callArea', function() {
		   		return { restrict: 'E'
		   			   , templateUrl: 'partials/call-area'
		   		}
		   })
})()
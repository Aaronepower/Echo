(function () {
  'use strict';
  angular.module('Intercom', [])
  function callController () {
    
  }

  function callDirective () {
    return { restrict : 'E'
           , templateUrl : 'partials/call-area'
           } 
  }

  angular
  .module('Intercom')
  .controller('CallController', callController)
  .directive('callArea', callDirective)
})()

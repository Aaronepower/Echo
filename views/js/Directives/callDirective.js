function callDirective () {
  return { restrict: 'E'
         , templateUrl: 'partials/call-area'
         }
}
angular.module('Intercom')
       .directive('callArea', callDirective)

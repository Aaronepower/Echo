function CallController (CallService) {
  this.call = CallService.sendOffer
  this.stop = function () {
    CallService.stop()
    // TODO Added the hide video logic here
  } 

angular.module('Intercom')
.controller('CallController', CallController)

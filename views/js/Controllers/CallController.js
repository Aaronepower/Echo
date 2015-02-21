function CallController (CallService) {
  this.call = CallService.sendOffer
  this.stop = CallService.endCall
}

angular.module('Intercom')
.controller('CallController', CallController)

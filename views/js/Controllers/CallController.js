function CallController (CallService) {
  this.call = CallService.sendOffer
}

angular.module('Intercom')
.controller('CallController', CallController)

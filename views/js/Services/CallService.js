function CallService (UserService) {
  function startCall(ID) {
    var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'local',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: 'remotes',
      // immediately ask for camera access
      autoRequestMedia: true
    })

    webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom(ID)
    })
  }

  function sendOffer() {
    console.log(UserService.getUser())
    console.log(UserService.getUserID())
    socket.emit('callOffer', UserService.getUserID(), UserService.getFriend())

    socket.on('callAccepted', function (receiverID) {
      startCall(receiverID)
    })
  }

  socket.on('callOffer', function (senderID) {
    console.log('Call Offered from: '+senderID)
    var callConfirm = confirm(senderID+' is calling you. Accept?')

    if (callConfirm) {
      socket.emit('callAccepted', senderID, UserService.getUserID())
      startCall(UserService.getUserID())
    }
    else {
      socket.emit('callRejected', senderID, UserService.getID())
    }
  })

  return { sendOffer : sendOffer
  }
}

angular.module('Intercom')
.factory('CallService', CallService)

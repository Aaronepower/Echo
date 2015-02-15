function CallService (UserService) {
  function startCall(ID) {

    rtc.connect('ws://localhost:8001', ID)

    var options = {'video': false, 'audio' : true}

    rtc.createStream(options, function (stream) {
      // get local stream for manipulation
      rtc.attachStream(stream, 'local')
    })

    var numOfVideos = 0
    rtc.on('add remote stream', function (stream){
      // show the remote video
      numOfVideos++

        var newVideoId = 'videoNum'+numOfVideos
      createVideo(newVideoId)
      rtc.attachStream(stream, newVideoId)
    })

    function createVideo (id) {
      var newVideo = document.createElement('video')
        , width    = 400
        , height   = 400

      newVideo.autoplay = true
      newVideo.width = width
      newVideo.height = height
      newVideo.id = id
      angular.element(document.getElementById('remotes')).append(newVideo)
    }
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

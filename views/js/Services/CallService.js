function CallService (UserService) {
  function startCall(ID) {
    // Set RTC options.
    var rtcOpts = {
        room: ID,
        signaller: 'localhost:8997'
      };
    // call RTC module
    var rtc = RTC(rtcOpts);
    // A div element to show our local video stream
    var localVideo = document.getElementById('local');
    // A div element to show our remote video streams
    var remoteVideo = document.getElementById('remotes');
    // A contenteditable element to show our messages
    var messageWindow = document.getElementById('messages');

    // Bind to events happening on the data channel
    function bindDataChannelEvents(id, channel, attributes, connection) {

      // Receive message
      channel.onmessage = function (evt) {
        messageWindow.innerHTML = evt.data;
      };

      // Send message
      messageWindow.onkeyup = function () {
        channel.send(this.innerHTML);
      };
    }

    // Start working with the established session
    function init(session) {
      session.createDataChannel('chat');
      session.on('channel:opened:chat', bindDataChannelEvents);
    }

    // Display local and remote video streams
    localVideo.appendChild(rtc.local);
    remoteVideo.appendChild(rtc.remote);

    // Detect when RTC has established a session
    rtc.on('ready', init);
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

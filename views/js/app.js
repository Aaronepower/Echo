(function () {
  'use strict';
  // var localStream
  //   , localPeerConnection
  //   , remotePeerConnection

  // var localVideo  = document.getElementById('localVideo')
  //   , remoteVideo = document.getElementById('remoteVideo')
  //   , startButton = document.getElementById('startButton')
  //   , callButton = document.getElementById('callButton')
  //   , hangButton = document.getElementById('hangButton')

  // startButton.disabled = false
  // callButton.disabled = true
  // hangButton.disabled = false
  // startButton.onclick = start
  // callButton.onclick = call
  // hangButton.onclick = hangup


  // function gotStream(stream) {
  //   trace("Received local stream")
  //   localVideo.src = window.URL.createObjectURL(stream)
  //   localStream = stream
  //   callButton.disabled = false
  // }

  // function start () {
  //   trace("Requesting local stream")
  //   startButton.disabled = true
  //   getUserMedia({video:true}, gotstream, function (error) {
  //     trace("getuserMedia Error: "+error)
  //   })
  // }

  // function call () {
  //   callButton.disabled = true
  //   hangButton.disabled = false
  //   trace("starting call")

  //   if (localStream.getVideoTracks().length > 0) {
  //     trace("Using video device "+localStream.getVideoTracks()[0].label)
  //   }

  //   var servers = null

  //   localPeerConnection = new RTCPeerConnection(servers)
  //   trace("Created local peer connection object localPeerConnection")
  //   localPeerConnection.onicecandidate = getLocalIceCandidate
    
  //   remotePeerConnection = new RTCPeerConnection(servers)
  //   trace("Created local peer connection object remotePeerConnection")
  //   remotePeerConnection.onicecandidate = getRemoteIceCandidate
  //   remotePeerConnection.onaddstream = gotRemoteStream

  //   localPeerConnection.addStream(localStream)
  //   trace("Added localStream to localPeerConnection")
  //   localPeerConnection.createOffer(gotLocalDescription, handleError)
  // }

  // function gotLocalDescription (description) {
  //   localPeerConnection.setLocalDescription(description)
  //   trace("Offer from localPeerConnection: \n"+ description.sdp)
  //   remotePeerConnection.setRemoteDescription(description)
  //   remotePeerConnection.createAnswer(gotRemoteDescription, handleError)
  // }

  // function gotRemoteDescription (description) {
  //   remotePeerConnection.setLocalDescription(description)
  //   trace("Offer from remotePeerConnection: \n"+ description.sdp)
  //   localPeerConnection.setRemoteDescription(description)
  // }

  // function hangup () {
  //   trace("Ending call")
  //   localPeerConnection.close()
  //   remotePeerConnection.close()
  //   localPeerConnection = null
  //   remotePeerConnection = null
  //   hangButton.disabled = true
  //   callButton.disabled = false
  // }

  // function gotRemoteStream (event) {
  //   remoteVideo.src = window.URL.createObjectURL(event.stream)
  //   trace("Received remote stream")
  // }

  // function gotLocalIceCandidate (event) {
  //   if (event.candidate) {
  //     remotePeerConnection.RTCIceCandidate(event.candidate)
  //     trace("got remote ICE candidate: \n"+ event.candidate.candidate)
  //   }
  // }

  // function handleError () {
    
  // }

  /*var isInitiator
    , room

    room = prompt('Enter room name')

    var socket = io.connect()

    if (room !== "") {
      console.log('Joining room ' + room)
      socket.emit('create or join', room)
    }

    socket.on('full', function (room) {
      console.log('Room '+ room+ ' is full')
    })

    socket.on('empty', function (room) {
      isInitiator = true
      console.log('Room '+room+' is empty')
    })

    socket.on('join', function (room) {
      console.log('Making request to join room '+room)
      console.log('Initator')
    })

    socket.on('log', function (array) {
      console.log.apply(console, array)
    })*/

  var isChannelReady
    , isInitator = false
    , isStarted  = false
    , localStream
    , pc
    , remoteStream
    , turnReady

  var pcConfig = {'iceServers' : [{'url': 'stun:stun.l.google.com:19302'}]}
    , pcConstraints = {'optional' : [{'StlsSrtpKeyAgreement' : true}]}
    , sdpConstraints = {'mandatory': { 'OfferToReceiveAudio' : true
                                     , 'OfferToReceiveVideo' : true
                                     }
                       }

  var room = location.pathname.substring(1)
  if (room === '') {
    room = 'foo'
  }
  else {

  }

  var socket = io.connect()

  if (room !== '') {
    console.log('Create or join room', room)
    socket.emit('create or join', room)
  }

  socket.on('created', function (room) {
    console.log('Created room' + room)
    isInitator = true
  })

  socket.on('full', function (room) {
    console.log('Room '+ room+ 'is full')
  })

  socket.on('join', function (room) {
    console.log('Another peer made request to join room '+room)
    console.log('This peer is the initator of room '+room+'!')
    isChannelReady = true
  })

  socket.on('joined', function (room) {
    console.log('This peer has joined room '+room)
    isChannelReady = true
  })

  socket.on('log', function (array) {
    console.log.apply(console, array)
  })

  function sendMessage (message) {
    console.log('client sending message ', message)

    socket.emit('message', message)
  }

  socket.on('message', function (message) {
    console.log('Client recieved message: ', message)

    if (message === 'got user media') {
      maybeStart()
    } else if (message.type === 'offer') {
        if (!isInitator && !isStarted) {
          maybeStart()
        }
        pc.setRemoteDescription(new RTCSessionDescription(message))
        doAnswer()
    } else if (message.type === 'answer') {
        pc.setRemoteDescription(new RTCSessionDescription(message))
    } else if (message.type === 'candidate' && isStarted) {
        var candidate = new RTCIceCandidate({ sdpLineIndex: message.label
                                            , candidate: message.candidate
                                            })
        pc.addIceCandidate(candidate)
    } else if (message === 'bye' && isStarted) {
      handleRemoteHangup()
    }
  })

  var localVideo = document.getElementById('localVideo')
    , remoteVideo = document.getElementById('remoteVideo')

  function handleUserMedia (stream) {
    console.log('Adding local stream')
    localVideo.src = window.URL.createObjectURL(stream)
    localStream = stream
    sendMessage('got user media')
    if (isInitator) {
      maybeStart()
    }
  }

  function handleUserMediaError (error) {
    console.log('getUserMedia error: ', error)
  }

  var constraints = {video : true}

  getUserMedia(constraints, handleUserMedia, handleUserMediaError)

  console.log('Getting user media with constraints', constraints)

  if (location.hostname != 'localhost') {
    requestTurn('https://computeengineondemand.appspot.com/turn?username=41784574&key=4080218913')
  }

  function maybeStart () {
    if (!isStarted && typeof localStream != 'undefined' && isChannelReady) {
      createPeerConnection()
      pc.addStream(localStream)
      isStarted = true

      console.log('isInitator', isInitator)
      if (isInitator) {
        doCall()
      }
    }
  }

  window.onbeforeunload = function (event) {
    sendMessage('bye')
  }

  function createPeerConnection () {
    try {
      pc = new RTCPeerConnection(null)
      pc.onicecandidate = handleIceCandidate
      pc.onaddstream = handleRemoteStreamAdded
      pc.onremovestream = handleRemoteStreamRemoved
      console.log('Created RTCPeerConnection')
    } catch (e) {
      console.log('Failed to create PeerConnection , exception: '+ e.message)
      alert('Cannot create RTCPeerConnection object')
      return
    }
  }

  function handleIceCandidate (event) {
    console.log('handleIceCandidate event: ', event)

    if (event.candidate) {
        sendMessage({ type : 'candidate'
                  , label : event.candidate.sdpMLineIndex
                  , id : event.candidate.sdpMid
                  , candidate : event.candidate.candidate
                  })
    } else {
        console.log('End of candidates')
    }
  }

  function handleRemoteStreamAdded (event) {
    console.log('Remote stream added.')
    remoteVideo.src = window.URL.createObjectURL(event.stream)
    remoteStream = event.stream
  }

  function handleCreateOfferError (event) {
    console.log('createOffer() error: ', error)
  }

  function doCall () {
    console.log('sending offer to peer')
    pc.createOffer(setLocalAndSendMessage, handleCreateOfferError)
  }

  function doAnswer () {
    console.log('answering offer to peer')
    pc.createOffer(setLocalAndSendMessage, null, sdpConstraints)
  }

  function setLocalAndSendMessage (sessionDescription) {
    sessionDescription.sdp = preferOpus(sessionDescription.sdp)
    pc.setLocalDescription(sessionDescription)
    console.log('setLocalAndSendMessage sending message ', sessionDescription)
    sendMessage(sessionDescription)
  }

  function requestTurn (turnURL) {
    var turnExists = false

    for (var i in pcConfig.iceServers) {
      if (pcConfig.iceServers[i].url.substr(0, 5) === 'turn:') {
        turnExists = true
        turnReady = true
        break;
      }
    }

    if (!turnExists) {
      console.log('Getting TURN server from ', turnURL)

      var xhr = new XMLHTTPRequest()
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          var turnServer = JSON.parse(xhr.responseText)
          console.log('Got TURN server ', turnServer)
          pcConfig.iceServers.push({ 'url' : 'turn:'+turnServer.username + '@'+turnServer.turn
                                   , 'credential' : turnServer.password})
          turnReady = true
        }
      }
      xhr.open('GET', turnURL, true)
      xhr.send()
    }
  }

  function handleRemoteStreamRemoved (event) {
    console.log('Remote stream removed. Event:', event)
  }

  function hangup () {
    console.log('Hanging up')
    stop()
    sendMessage('bye')
  }

  function handleRemoteHangup () {
    
  }

  function stop () {
    isStarted = false
    pc.close()
    pc = null
  }

  function preferOpus (sdp) {
    var sdpLines = sdp.split('\r\n')
    var mLineIndex
    for (var i = 0; i < sdpLines.length; i++) {
      if (sdpLines[i].search('m=audio' !== -1)) {
        mLineIndex = i
        break;
      }
    }
    if (mLineIndex === null) {
      return sdp
    }

    for (var secondIndex = 0; secondIndex < sdpLines.length; secondIndex++) {
      if (sdpLines[secondIndex].search('opus/48000') !== -1) {
        var opusPayload = extractSdp(sdpLines[secondIndex], /:(d+) opus\/48000/i)
        if (opusPayload) {
          sdpLines[mLineIndex] = setDefaultCodec(sdpLines[mLineIndex], opusPayload)
        }
        break;
      }
    }

    sdpLines = removeCN(sdpLines, mLineIndex)

    sdp = sdpLines.join('\r\n')
    return sdp
  }

  function extractSdp (sdpLine, pattern) {
    var result = sdpLine.match(pattern)
    return result && result.length === 2 ? result[1] : null
  }

  function setDefaultCodec (mLine, payload) {
    var elements = mLine.split(' ')
      , newLine = []
      , index = 0

    for (var i = 0; i < elements.length; i++) {
      if (index === 3) {
        newLine[index++] = payload
      }
      if (elements[i] !== payload) {
        newLine[index++] = elements[i]
      }
    }
    return newLine.join(' ')
  }

  function removeCN (sdpLines, mLineIndex) {
    var mLinesElements = sdpLines[mLineIndex].split(' ')

    for (var i = sdpLines.length - 1; i >= 0; i--) {
      var payload = extractSdp(sdpLines[i], /a=rtpmap:(\d+) CN\/d+/i)
      if (payload) {
        var cnPos = mLinesElements.indexOf(payload)
        if (cnPos !== -1) {
          mLinesElements.splice(cnPos, 1)
        }
        sdpLines.splice(i, 1)
      }
    }

    sdpLines[mLineIndex] = mLinesElements.join(' ')
    return sdpLines
  }
})()
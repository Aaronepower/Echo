(function () {
  'use strict';
  var localStream
    , localPeerConnection
    , remotePeerConnection

  var localVideo  = document.getElementById('localVideo')
    , remoteVideo = document.getElementById('remoteVideo')
    , startButton = document.getElementById('startButton')
    , callButton = document.getElementById('callButton')
    , hangButton = document.getElementById('hangButton')

  startButton.disabled = false
  callButton.disabled = true
  hangButton.disabled = false
  startButton.onclick = start
  callButton.onclick = call
  hangButton.onclick = hangup


  function gotStream (stream) {
    trace("Received local stream")
    localVideo.src = window.URL.createObjectURL(stream)
    localStream = stream
    callButton.disabled = false
  }

  function start () {
    trace("Requesting local stream")
    startButton.disabled = true
    getUserMedia({video:true}, gotStream, function (error) {
      trace("getuserMedia Error: "+error)
    })
  }

  function call () {
    callButton.disabled = true
    hangButton.disabled = false
    trace("starting call")

    if (localStream.getVideoTracks().length > 0) {
      trace("Using video device "+localStream.getVideoTracks()[0].label)
    }

    var servers = null

    localPeerConnection = new RTCPeerConnection(servers)
    trace("Created local peer connection object localPeerConnection")
    localPeerConnection.onicecandidate = gotLocalIceCandidate
    
    remotePeerConnection = new RTCPeerConnection(servers)
    trace("Created local peer connection object remotePeerConnection")
    remotePeerConnection.onicecandidate = gotRemoteIceCandidate
    remotePeerConnection.onaddstream = gotRemoteStream

    localPeerConnection.addStream(localStream)
    trace("Added localStream to localPeerConnection")
    localPeerConnection.createOffer(gotLocalDescription, handleError)
  }

  function gotLocalDescription (description) {
    localPeerConnection.setLocalDescription(description)
    trace("Offer from localPeerConnection: \n"+ description.sdp)
    remotePeerConnection.setRemoteDescription(description)
    remotePeerConnection.createAnswer(gotRemoteDescription, handleError)
  }

  function gotRemoteDescription (description) {
    remotePeerConnection.setLocalDescription(description)
    trace("Offer from remotePeerConnection: \n"+ description.sdp)
    localPeerConnection.setRemoteDescription(description)
  }

  function hangup () {
    trace("Ending call")
    localPeerConnection.close()
    remotePeerConnection.close()
    localPeerConnection = null
    remotePeerConnection = null
    hangButton.disabled = true
    callButton.disabled = false
  }

  function gotRemoteStream (event) {
    remoteVideo.src = window.URL.createObjectURL(event.stream)
    trace("Received remote stream")
  }

  function gotLocalIceCandidate (event) {
    if (event.candidate) {
      remotePeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
      trace("got remote ICE candidate: \n"+ event.candidate.candidate)
    }
  }

  function gotRemoteIceCandidate (event) {
    if (event.candidate) {
      localPeerConnection.addIceCandidate(new RTCIceCandidate(event.candidate))
      trace("got local ICE candidate: \n"+ event.candidate.candidate)
    }
  }

  function handleError () {
    
  }
})()
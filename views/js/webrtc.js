(function () {
  'use strict';
  var roomNum = alert('Enter room number')
  rtc.connect('ws://localhost:8001', roomNum)

  rtc.createStream({'video': true, 'audio':false}, function (stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'local')
  })

  var numOfVideos = 0
  rtc.on('add remote stream', function (stream){
    // show the remote video
    numOfVideos++
    var newVideo = document.createElement('video')
      , width    = 400
      , height   = 400

    newVideo.autoplay = true
    newVideo.width = width
    newVideo.height = height
    newVideo.id = 'videoNum'+numOfVideos
    document.getElementById('videoContainer').appendChild(newVideo)
    rtc.attachStream(stream, newVideo.id)
  })
})()
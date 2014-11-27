(function () {
  'use strict';
  /** global rtc */
  rtc.connect('ws://localhost:8001');

  rtc.createStream({'video': true, 'audio':false}, function (stream){
    // get local stream for manipulation
    rtc.attachStream(stream, 'local');
  });

  var numOfVideos = 0;
  rtc.on('add remote stream', function (stream){
    // show the remote video
    numOfVideos++
    rtc.attachStream(stream, 'video'+numOfVideos)
  })
})()
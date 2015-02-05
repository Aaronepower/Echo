(function() {
	'use strict';
	angular.module('Intercom')
	.controller('CallController', function ($resource) {
		this.call = function() {
			rtc.connect('ws://localhost:8001', 10)

			var options = {'video': true, 'audio':false}

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
				document.getElementById('videoContainer')
				.appendChild(newVideo)
			}
		}
	})
})()
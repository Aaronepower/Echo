(function () {
  'use strict';
  function editorController ($scope, $element, socket, caret, file, HighlighterService) {
    var vm = this
    $scope.fileText = ''

    vm.highlightEvent = function () {
      caret.setStart(HighlighterService.highlight($scope.fileText, vm.file.keywords, true))
    }

    $scope.$watch('fileText', function (newText) {
      $('#editor').text(newText)
    })

    socket.on('backspace', function (index, endPoint) {
      console.log('message')
      $scope.fileText = caret.removeSel($scope.fileText, index, endPoint)
      $('#editor').text($scope.fileText)
      // vm.highlightEvent()
    })

    socket.on('change', function (index, msg) {
      console.log(index)
      $scope.fileText = caret.insertText($scope.fileText, index, msg)
      console.log($scope.fileText);
      $('#editor').text($scope.fileText)
      // vm.highlightEvent()
    })

    // socket.on('keyword', function (keyword) {
    //   vm.file.keywords.push(keyword)
    //   // if (vm.file.keywords.length === 29) {
    //   //   HighlighterService.highlight($scope.fileText, vm.file.keywords)
    //   // }
    // })

    socket.on('file', function (doc) {
      $scope.fileText =doc.contents
      var regex = /(\n)/g
      file.setLineNums((regex.test($scope.fileText) ? $scope.fileText.match(regex).length : 0))
      $('#editor').text($scope.fileText)
    })

    $element.bind('keypress', function (event) {
      var inputCode = event.which
      var character = String.fromCharCode(inputCode)
      var index     = caret.getStart()
      socket.emit('change', index, character)
      // vm.highlightEvent()
    })

    $element.bind('keydown', function (event) {
      var inputCode = event.which
      if (inputCode && inputCode < 0x30) {
        var str        = $('#editor').text()
        ,   index      = caret.getStart()
        ,   startPoint = index - caret.getSelectionText().length

        switch(inputCode) {
          case 8: // Backspace
          if (startPoint <= 0) {
            socket.emit('backspace', index, index)
            caret.removeSel($scope.fileText, index, index)
          }
          else {
            socket.emit('backspace', startPoint, index)
            caret.removeSel($scope.fileText, startPoint, index)
          }
          break;
          case 9: // Tab
          $('#editor').text(caret.insertText(str, index, '\t'))
          socket.emit('change', index, '\t')
          caret.setStart(index+1)
          break;
          case 13: //Return Carriage
          index = caret.getStart()
          console.log(index);
          $('#editor').text(caret.insertText(str, index, '\n'))
          socket.emit('change', index, '\n')
          caret.setStart(index+1)
          break;
        }
        // vm.highlightEvent()
        if (inputCode === 9 || inputCode === 13) {
          return false
        }
      }
    })
    // $element.bind('click', function (event) {
    //   console.log(JSON.stringify());
    // })
}

angular
.module('EditorApp', ['SocketFactory','CaretService', 'HighlighterService', 'FileService'])
.controller('EditorCtrl', editorController)
})()
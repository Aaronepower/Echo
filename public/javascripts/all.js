angular.module("templates").run(["$templateCache",function(e){e.put("app.js","(function () {\r\n  'use strict';\r\n  function editorController ($scope, $element, socket, caret, file, HighlighterService) {\r\n    var vm = this\r\n    $scope.fileText = ''\r\n\r\n    vm.highlightEvent = function () {\r\n      caret.setStart(HighlighterService.highlight($scope.fileText, vm.file.keywords, true))\r\n    }\r\n\r\n    $scope.$watch('fileText', function (newText) {\r\n      $('#editor').text(newText)\r\n    })\r\n\r\n    socket.on('backspace', function (index, endPoint) {\r\n      console.log('message')\r\n      $scope.fileText = caret.removeSel($scope.fileText, index, endPoint)\r\n      $('#editor').text($scope.fileText)\r\n      // vm.highlightEvent()\r\n    })\r\n\r\n    socket.on('change', function (index, msg) {\r\n      console.log(index)\r\n      $scope.fileText = caret.insertText($scope.fileText, index, msg)\r\n      console.log($scope.fileText);\r\n      $('#editor').text($scope.fileText)\r\n      // vm.highlightEvent()\r\n    })\r\n\r\n    // socket.on('keyword', function (keyword) {\r\n    //   vm.file.keywords.push(keyword)\r\n    //   // if (vm.file.keywords.length === 29) {\r\n    //   //   HighlighterService.highlight($scope.fileText, vm.file.keywords)\r\n    //   // }\r\n    // })\r\n\r\n    socket.on('file', function (doc) {\r\n      $scope.fileText =doc.contents\r\n      var regex = /(\\n)/g\r\n      file.setLineNums((regex.test($scope.fileText) ? $scope.fileText.match(regex).length : 0))\r\n      $('#editor').text($scope.fileText)\r\n    })\r\n\r\n    $element.bind('keypress', function (event) {\r\n      var inputCode = event.which\r\n      var character = String.fromCharCode(inputCode)\r\n      var index     = caret.getStart()\r\n      socket.emit('change', index, character)\r\n      // vm.highlightEvent()\r\n    })\r\n\r\n    $element.bind('keydown', function (event) {\r\n      var inputCode = event.which\r\n      if (inputCode && inputCode < 0x30) {\r\n        var str        = $('#editor').text()\r\n        ,   index      = caret.getStart()\r\n        ,   startPoint = index - caret.getSelectionText().length\r\n\r\n        switch(inputCode) {\r\n          case 8: // Backspace\r\n          if (startPoint <= 0) {\r\n            socket.emit('backspace', index, index)\r\n            caret.removeSel($scope.fileText, index, index)\r\n          }\r\n          else {\r\n            socket.emit('backspace', startPoint, index)\r\n            caret.removeSel($scope.fileText, startPoint, index)\r\n          }\r\n          break;\r\n          case 9: // Tab\r\n          $('#editor').text(caret.insertText(str, index, '\\t'))\r\n          socket.emit('change', index, '\\t')\r\n          caret.setStart(index+1)\r\n          break;\r\n          case 13: //Return Carriage\r\n          index = caret.getStart()\r\n          console.log(index);\r\n          $('#editor').text(caret.insertText(str, index, '\\n'))\r\n          socket.emit('change', index, '\\n')\r\n          caret.setStart(index+1)\r\n          break;\r\n        }\r\n        // vm.highlightEvent()\r\n        if (inputCode === 9 || inputCode === 13) {\r\n          return false\r\n        }\r\n      }\r\n    })\r\n    // $element.bind('click', function (event) {\r\n    //   console.log(JSON.stringify());\r\n    // })\r\n}\r\neditorController.$inject = [\"$scope\", \"$element\", \"socket\", \"caret\", \"file\", \"HighlighterService\"];\r\n\r\nangular\r\n.module('EditorApp', ['SocketFactory','CaretService', 'HighlighterService', 'FileService'])\r\n.controller('EditorCtrl', editorController)\r\n})()")}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRlbXBsYXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxRQUFBLE9BQUEsYUFBQSxLQUFBLGlCQUFBLFNBQUEsR0FBQSxFQUFBLElBQUEsU0FBQSIsImZpbGUiOiJhbGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZShcInRlbXBsYXRlc1wiKS5ydW4oW1wiJHRlbXBsYXRlQ2FjaGVcIiwgZnVuY3Rpb24oJHRlbXBsYXRlQ2FjaGUpIHskdGVtcGxhdGVDYWNoZS5wdXQoXCJhcHAuanNcIixcIihmdW5jdGlvbiAoKSB7XFxyXFxuICBcXCd1c2Ugc3RyaWN0XFwnO1xcclxcbiAgZnVuY3Rpb24gZWRpdG9yQ29udHJvbGxlciAoJHNjb3BlLCAkZWxlbWVudCwgc29ja2V0LCBjYXJldCwgZmlsZSwgSGlnaGxpZ2h0ZXJTZXJ2aWNlKSB7XFxyXFxuICAgIHZhciB2bSA9IHRoaXNcXHJcXG4gICAgJHNjb3BlLmZpbGVUZXh0ID0gXFwnXFwnXFxyXFxuXFxyXFxuICAgIHZtLmhpZ2hsaWdodEV2ZW50ID0gZnVuY3Rpb24gKCkge1xcclxcbiAgICAgIGNhcmV0LnNldFN0YXJ0KEhpZ2hsaWdodGVyU2VydmljZS5oaWdobGlnaHQoJHNjb3BlLmZpbGVUZXh0LCB2bS5maWxlLmtleXdvcmRzLCB0cnVlKSlcXHJcXG4gICAgfVxcclxcblxcclxcbiAgICAkc2NvcGUuJHdhdGNoKFxcJ2ZpbGVUZXh0XFwnLCBmdW5jdGlvbiAobmV3VGV4dCkge1xcclxcbiAgICAgICQoXFwnI2VkaXRvclxcJykudGV4dChuZXdUZXh0KVxcclxcbiAgICB9KVxcclxcblxcclxcbiAgICBzb2NrZXQub24oXFwnYmFja3NwYWNlXFwnLCBmdW5jdGlvbiAoaW5kZXgsIGVuZFBvaW50KSB7XFxyXFxuICAgICAgY29uc29sZS5sb2coXFwnbWVzc2FnZVxcJylcXHJcXG4gICAgICAkc2NvcGUuZmlsZVRleHQgPSBjYXJldC5yZW1vdmVTZWwoJHNjb3BlLmZpbGVUZXh0LCBpbmRleCwgZW5kUG9pbnQpXFxyXFxuICAgICAgJChcXCcjZWRpdG9yXFwnKS50ZXh0KCRzY29wZS5maWxlVGV4dClcXHJcXG4gICAgICAvLyB2bS5oaWdobGlnaHRFdmVudCgpXFxyXFxuICAgIH0pXFxyXFxuXFxyXFxuICAgIHNvY2tldC5vbihcXCdjaGFuZ2VcXCcsIGZ1bmN0aW9uIChpbmRleCwgbXNnKSB7XFxyXFxuICAgICAgY29uc29sZS5sb2coaW5kZXgpXFxyXFxuICAgICAgJHNjb3BlLmZpbGVUZXh0ID0gY2FyZXQuaW5zZXJ0VGV4dCgkc2NvcGUuZmlsZVRleHQsIGluZGV4LCBtc2cpXFxyXFxuICAgICAgY29uc29sZS5sb2coJHNjb3BlLmZpbGVUZXh0KTtcXHJcXG4gICAgICAkKFxcJyNlZGl0b3JcXCcpLnRleHQoJHNjb3BlLmZpbGVUZXh0KVxcclxcbiAgICAgIC8vIHZtLmhpZ2hsaWdodEV2ZW50KClcXHJcXG4gICAgfSlcXHJcXG5cXHJcXG4gICAgLy8gc29ja2V0Lm9uKFxcJ2tleXdvcmRcXCcsIGZ1bmN0aW9uIChrZXl3b3JkKSB7XFxyXFxuICAgIC8vICAgdm0uZmlsZS5rZXl3b3Jkcy5wdXNoKGtleXdvcmQpXFxyXFxuICAgIC8vICAgLy8gaWYgKHZtLmZpbGUua2V5d29yZHMubGVuZ3RoID09PSAyOSkge1xcclxcbiAgICAvLyAgIC8vICAgSGlnaGxpZ2h0ZXJTZXJ2aWNlLmhpZ2hsaWdodCgkc2NvcGUuZmlsZVRleHQsIHZtLmZpbGUua2V5d29yZHMpXFxyXFxuICAgIC8vICAgLy8gfVxcclxcbiAgICAvLyB9KVxcclxcblxcclxcbiAgICBzb2NrZXQub24oXFwnZmlsZVxcJywgZnVuY3Rpb24gKGRvYykge1xcclxcbiAgICAgICRzY29wZS5maWxlVGV4dCA9ZG9jLmNvbnRlbnRzXFxyXFxuICAgICAgdmFyIHJlZ2V4ID0gLyhcXFxcbikvZ1xcclxcbiAgICAgIGZpbGUuc2V0TGluZU51bXMoKHJlZ2V4LnRlc3QoJHNjb3BlLmZpbGVUZXh0KSA/ICRzY29wZS5maWxlVGV4dC5tYXRjaChyZWdleCkubGVuZ3RoIDogMCkpXFxyXFxuICAgICAgJChcXCcjZWRpdG9yXFwnKS50ZXh0KCRzY29wZS5maWxlVGV4dClcXHJcXG4gICAgfSlcXHJcXG5cXHJcXG4gICAgJGVsZW1lbnQuYmluZChcXCdrZXlwcmVzc1xcJywgZnVuY3Rpb24gKGV2ZW50KSB7XFxyXFxuICAgICAgdmFyIGlucHV0Q29kZSA9IGV2ZW50LndoaWNoXFxyXFxuICAgICAgdmFyIGNoYXJhY3RlciA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaW5wdXRDb2RlKVxcclxcbiAgICAgIHZhciBpbmRleCAgICAgPSBjYXJldC5nZXRTdGFydCgpXFxyXFxuICAgICAgc29ja2V0LmVtaXQoXFwnY2hhbmdlXFwnLCBpbmRleCwgY2hhcmFjdGVyKVxcclxcbiAgICAgIC8vIHZtLmhpZ2hsaWdodEV2ZW50KClcXHJcXG4gICAgfSlcXHJcXG5cXHJcXG4gICAgJGVsZW1lbnQuYmluZChcXCdrZXlkb3duXFwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcXHJcXG4gICAgICB2YXIgaW5wdXRDb2RlID0gZXZlbnQud2hpY2hcXHJcXG4gICAgICBpZiAoaW5wdXRDb2RlICYmIGlucHV0Q29kZSA8IDB4MzApIHtcXHJcXG4gICAgICAgIHZhciBzdHIgICAgICAgID0gJChcXCcjZWRpdG9yXFwnKS50ZXh0KClcXHJcXG4gICAgICAgICwgICBpbmRleCAgICAgID0gY2FyZXQuZ2V0U3RhcnQoKVxcclxcbiAgICAgICAgLCAgIHN0YXJ0UG9pbnQgPSBpbmRleCAtIGNhcmV0LmdldFNlbGVjdGlvblRleHQoKS5sZW5ndGhcXHJcXG5cXHJcXG4gICAgICAgIHN3aXRjaChpbnB1dENvZGUpIHtcXHJcXG4gICAgICAgICAgY2FzZSA4OiAvLyBCYWNrc3BhY2VcXHJcXG4gICAgICAgICAgaWYgKHN0YXJ0UG9pbnQgPD0gMCkge1xcclxcbiAgICAgICAgICAgIHNvY2tldC5lbWl0KFxcJ2JhY2tzcGFjZVxcJywgaW5kZXgsIGluZGV4KVxcclxcbiAgICAgICAgICAgIGNhcmV0LnJlbW92ZVNlbCgkc2NvcGUuZmlsZVRleHQsIGluZGV4LCBpbmRleClcXHJcXG4gICAgICAgICAgfVxcclxcbiAgICAgICAgICBlbHNlIHtcXHJcXG4gICAgICAgICAgICBzb2NrZXQuZW1pdChcXCdiYWNrc3BhY2VcXCcsIHN0YXJ0UG9pbnQsIGluZGV4KVxcclxcbiAgICAgICAgICAgIGNhcmV0LnJlbW92ZVNlbCgkc2NvcGUuZmlsZVRleHQsIHN0YXJ0UG9pbnQsIGluZGV4KVxcclxcbiAgICAgICAgICB9XFxyXFxuICAgICAgICAgIGJyZWFrO1xcclxcbiAgICAgICAgICBjYXNlIDk6IC8vIFRhYlxcclxcbiAgICAgICAgICAkKFxcJyNlZGl0b3JcXCcpLnRleHQoY2FyZXQuaW5zZXJ0VGV4dChzdHIsIGluZGV4LCBcXCdcXFxcdFxcJykpXFxyXFxuICAgICAgICAgIHNvY2tldC5lbWl0KFxcJ2NoYW5nZVxcJywgaW5kZXgsIFxcJ1xcXFx0XFwnKVxcclxcbiAgICAgICAgICBjYXJldC5zZXRTdGFydChpbmRleCsxKVxcclxcbiAgICAgICAgICBicmVhaztcXHJcXG4gICAgICAgICAgY2FzZSAxMzogLy9SZXR1cm4gQ2FycmlhZ2VcXHJcXG4gICAgICAgICAgaW5kZXggPSBjYXJldC5nZXRTdGFydCgpXFxyXFxuICAgICAgICAgIGNvbnNvbGUubG9nKGluZGV4KTtcXHJcXG4gICAgICAgICAgJChcXCcjZWRpdG9yXFwnKS50ZXh0KGNhcmV0Lmluc2VydFRleHQoc3RyLCBpbmRleCwgXFwnXFxcXG5cXCcpKVxcclxcbiAgICAgICAgICBzb2NrZXQuZW1pdChcXCdjaGFuZ2VcXCcsIGluZGV4LCBcXCdcXFxcblxcJylcXHJcXG4gICAgICAgICAgY2FyZXQuc2V0U3RhcnQoaW5kZXgrMSlcXHJcXG4gICAgICAgICAgYnJlYWs7XFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgICAvLyB2bS5oaWdobGlnaHRFdmVudCgpXFxyXFxuICAgICAgICBpZiAoaW5wdXRDb2RlID09PSA5IHx8IGlucHV0Q29kZSA9PT0gMTMpIHtcXHJcXG4gICAgICAgICAgcmV0dXJuIGZhbHNlXFxyXFxuICAgICAgICB9XFxyXFxuICAgICAgfVxcclxcbiAgICB9KVxcclxcbiAgICAvLyAkZWxlbWVudC5iaW5kKFxcJ2NsaWNrXFwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcXHJcXG4gICAgLy8gICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeSgpKTtcXHJcXG4gICAgLy8gfSlcXHJcXG59XFxyXFxuZWRpdG9yQ29udHJvbGxlci4kaW5qZWN0ID0gW1xcXCIkc2NvcGVcXFwiLCBcXFwiJGVsZW1lbnRcXFwiLCBcXFwic29ja2V0XFxcIiwgXFxcImNhcmV0XFxcIiwgXFxcImZpbGVcXFwiLCBcXFwiSGlnaGxpZ2h0ZXJTZXJ2aWNlXFxcIl07XFxyXFxuXFxyXFxuYW5ndWxhclxcclxcbi5tb2R1bGUoXFwnRWRpdG9yQXBwXFwnLCBbXFwnU29ja2V0RmFjdG9yeVxcJyxcXCdDYXJldFNlcnZpY2VcXCcsIFxcJ0hpZ2hsaWdodGVyU2VydmljZVxcJywgXFwnRmlsZVNlcnZpY2VcXCddKVxcclxcbi5jb250cm9sbGVyKFxcJ0VkaXRvckN0cmxcXCcsIGVkaXRvckNvbnRyb2xsZXIpXFxyXFxufSkoKVwiKTt9XSk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
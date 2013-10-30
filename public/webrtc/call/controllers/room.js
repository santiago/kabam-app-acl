  var remoteVideoContainer = document.getElementById('remote-video-container');
  var localVideoContainer = document.getElementById('local-video-container');

  var globalSpace = io.connect('ws://localhost:3000');

  function RoomController($scope, $http) {

    $scope.room = {
      messages: [],
      newMessage: ''
    };

    $scope.sendMessage = function() {
      socket.emit('chat:newMessage', {
        content: $scope.room.newMessage
      });
      $scope.room.newMessage = '';
    }

    globalSpace.on('chat:newMessage', function(data) {
      $scope.room.messages.push(data);
      $scope.$apply();
    });

    // partner disconnect
    globalSpace.on('chat:disconnect', function(data) {
      if (roomId == data.roomid) {
        $('#' + data.userid).remove();
        $scope.room.messages.push(data);
        $scope.$apply();
      }
    });

  }

  // CHAT - CALLING
  globalSpace.on('connect', function() {

    // The roomId is defined in room server-side views
    // check out the details on views/webrtc/call/room.html
    globalSpace.emit('chat:joinRoom', {
      roomId: roomId
    });

    globalSpace.on('chat:id', function(data) {

      var peer = new PeerConnection({
        socketEvent: 'calling',
        socket: globalSpace,
        userid: data.username
      });

      peer.onStreamAdded = function(e) {
        var video = e.mediaElement;
        video.setAttribute('width', '100%');
        video.setAttribute('controls', false);

        if (e.type == 'local') {
          localVideoContainer.insertBefore(video, null);
        } else {
          // Just add 1 remote video for 1 user
          if (remoteVideoContainer.childElementCount > 0 && document.getElementById(e.userid)) return;
          // Add new remote video
          remoteVideoContainer.insertBefore(video, null);
        }

        video.play();
      };

      peer.onUserFound = function(userid) {
        peer.sendParticipationRequest(userid);
      };

      // Auto broadcasting
      (function startBroadcast() {
        if (peer.startBroadcasting) peer.startBroadcasting();
        else setTimeout(startBroadcast, 1000);
      })();
    });

  });
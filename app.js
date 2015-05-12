var playlyticsApp = angular.module('playlyticsApp', ['ui.sortable']);

playlyticsApp.controller('AppCtrl', function ($scope, $http) {
  $scope.playList = JSON.parse(localStorage.getItem("playlist"))

  $scope.sortableOptions = {
    stop: function(e, ui) {
      addToPlayListToLocalStorage($scope.playList)
    }
  }

  var calculateCoolnessFactor = function(playList) {
    var durationPopularity = 0
    var totalDuration = 0
    for(i=0; i<playList.length; i++) {
      durationPopularity += playList[i].duration_ms * playList[i].popularity
      totalDuration += playList[i].duration_ms
    }
    $scope.playlistCoolness = durationPopularity / totalDuration
    $scope.totalDuration = totalDuration
  }

  if ($scope.playList != null) {
    calculateCoolnessFactor($scope.playList)
  }

  $scope.search = function($event) {
    searchSpotifyAPI($scope.song)
  }


  $scope.addToPlayList = function(track) {
    if($scope.playList) {
      $scope.playList.push(track)
    }
    else {
      $scope.playList = []
      $scope.playList.push(track)
    }
    calculateCoolnessFactor($scope.playList)
    addToPlayListToLocalStorage($scope.playList)
  }

  $scope.removeFromPlayList = function(track) {
    var index = $scope.playList.indexOf(track)
    if (index > -1) {
      $scope.playList.splice(index, 1);
    }
    calculateCoolnessFactor($scope.playList)
    if ($scope.playList.length > 0) {
      addToPlayListToLocalStorage($scope.playList)
    }
    else {
      removePlayListFromLocalStorage($scope.playList)
    }
  }

  var searchSpotifyAPI = function(song) {
    var req = {
      method: 'GET',
      url: 'https://api.spotify.com/v1/search?q=' + song + '&type=track&limit=10'
    }
    $http(req).success(function(data) {
      $scope.tracks = data.tracks.items
    }).error(function() {
      console.log('error')
    })
  }

  var addToPlayListToLocalStorage = function(playlist) {
    if(typeof(Storage) !== "undefined") {
      var playlistJsonString = JSON.stringify(playlist)
      localStorage.setItem("playlist", playlistJsonString);
    } else {
        // Sorry! No Web Storage support..
    }
  }

  var removePlayListFromLocalStorage = function(playlist) {
    localStorage.removeItem("playlist")
  }

})

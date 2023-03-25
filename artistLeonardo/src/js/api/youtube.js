/**
 * Created by developercomputer on 27.10.15.
 */
module.exports = {
  init(ln) {
    switch (ln) {
      case "en":
        this.youtube_channel_id = this.youtube_channel_id_FAT;
        this.vip_playlist_id = this.vip_playlist_id_FAT;
        break;
      case "es":
        this.youtube_channel_id = this.youtube_channel_id_AD;
        this.vip_playlist_id = this.vip_playlist_id_AD;
        break;
      default:
        this.youtube_channel_id = this.youtube_channel_id_AD;
        this.vip_playlist_id = this.vip_playlist_id_AD;
        break;
    }
  },
  api_key : 'AIzaSyCZdQnnC2S9lzKFFPM2aoS_FyH4z3S0hAE',
  base_uri: 'https://www.googleapis.com/youtube/v3/',
  youtube_channel_id_AD: 'UCHfLKhGTWPq7TYwntNF2otA',
  vip_playlist_id_AD: "PLI2QDeRwRQw6QR9rimTd__XNgpYSRNnV-",
  youtube_channel_id_FAT: 'UCaapxaQKJFJ6XC56CHgeTzw',
  vip_playlist_id_FAT: "PLOdvsn4gGyr_WDJrO6RCCrW6twNwre2Dd",
  youtube_channel_id: null,
  vip_playlist_id: null,
  getPlayLists(youtube_channel_id) {
    return  `https://www.googleapis.com/youtube/v3/playlists?key=${this.api_key}&channelId=${youtube_channel_id}&part=snippet&order=date&maxResults=50`;
  },
  getVideos(playListId) {
    return `https://www.googleapis.com/youtube/v3/playlistItems?key=${this.api_key}&playlistId=${playListId}&part=snippet&order=date&maxResults=50`;
  },
  getLastVideo() {
    return `https://www.googleapis.com/youtube/v3/search?key=${this.api_key}&channelId=${this.youtube_channel_id}&part=snippet,id&order=date&maxResults=20`;
  },
  //Метод для получения последнего видео с канала и плейлиста содержащего это видео.
  getInfoForPush() {
    var urlToGetLastVideo = this.getLastVideo();
    //Делаем запрос на получения последенего видео
    $$.getJSON(urlToGetLastVideo, (lastVideoRes) => {
      //Первый элемент массива - последнее видео выложенное на канале
      var lastVideoId = lastVideoRes.items[0].id.videoId;
      //делаем еще 1 запрос на получение списка плейлистов.
      var urlToGetPlaylists = this.getPlayLists(this.youtube_channel_id);
      $$.getJSON(urlToGetPlaylists, (playlists) => {
        var items = playlists.items;
        //Создаем ряд запросов для получения списка видео из плейлистов.
        var queries = items.map((item) => {
          return new Promise((resolve, reject) => {
            $$.getJSON(this.getVideos(item.id), res3 => resolve(res3), (err) => reject(err));
          });
        });
        //Выполняем запросы. Когда все они будут выполнены, начнется исполнение колбека.
        Promise.all(queries)
          .then((results) => {
              var playlistInfo;
              var lastVideoInfo = lastVideoRes.items[0];
              var playlistOfLastVideo = "";
              for(var i = 0, len = results.length; i < len; i++) {
                let playlistItem = results[i];
                for(var j = 0, len2 = playlistItem.items.length; j < len2; j++) {
                  let videoInfo = playlistItem.items[j];
                  if(videoInfo.snippet.resourceId.videoId === lastVideoId) {
                    playlistOfLastVideo = videoInfo.snippet.playlistId;
                    break;
                  }
                }
              }
              for(i = 0, len = playlists.items.length; i < len; i++) {
                let playlistId = playlists.items[i].id;
                if(playlistId === playlistOfLastVideo) {
                  playlistInfo = playlists.items[i];
                  break;
                }
              }
          })
          .catch((e) => console.log(e));
      });
    });
  }
};

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
  findPlaylistOfVideo(video_id) {
    return `https://www.googleapis.com/youtube/v3/search?key=${this.api_key}&channelId=${this.youtube_channel_id}&relatedToVideoId=${video_id}&type=playlist&part=snippet&order=date&maxResults=20`;
  }
};

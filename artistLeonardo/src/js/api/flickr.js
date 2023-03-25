/**
 * Created by developercomputer on 28.10.15.
 */
module.exports = {
  init(ln) {
    switch (ln) {
      case "en":
        this.user_id = this.user_id_FAT;
        this.media_album_id = this.media.en;
        break;
      case "es":
        this.user_id = this.user_id_AD;
        this.media_album_id = this.media.es;
        break;
      default:
        this.user_id = this.user_id_AD;
        this.media_album_id = this.media.es;
        break;
    }
  },
  api_key: "7b6c255fb3799b29ba43d531a1c5a754",
  api_secret: "89c96e48dd96d63b",
  user_id_AD: "136950092@N04",
  user_id_FAT: "53986304@N06",
  user_id: null,
  media: {
    en: "72157662165724815",
    es: "72157662419542046"
  },
  media_album_id: "",
  photosets_getList(user_id) {
    return `https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=${this.api_key}&user_id=${user_id}&format=json&nojsoncallback=1`;
  },
  getAlbumThumbnail(farm, server, primary, secret) {
    return `https://farm${farm}.static.flickr.com/${server}/${primary}_${secret}_b.jpg`;
  },
  getPhotoThumbnail(farm, server, id, secret) {
    return `https://farm${farm}.staticflickr.com/${server}/${id}_${secret}_b.jpg`;
  },
  photosets_getPhotos(photoset_id, user_id) {
    return `https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key=${this.api_key}&photoset_id=${photoset_id}&user_id=${user_id}&format=json&nojsoncallback=1`;
  },
  photosets_getInfo(photo_id) {
    return `https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=${this.api_key}&photo_id=${photo_id}&format=json&nojsoncallback=1`;
  }
};

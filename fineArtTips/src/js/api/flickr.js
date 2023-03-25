/**
 * Created by developercomputer on 28.10.15.
 */
module.exports = {
  init(ln) {
    switch (ln) {
      case "en":
        this.user_id = this.user_id_FAT;
        break;
      case "es":
        this.user_id = this.user_id_AD;
        break;
      default:
        this.user_id = this.user_id_AD;
        break;
    }
  },
  api_key: "7b6c255fb3799b29ba43d531a1c5a754",
  api_secret: "89c96e48dd96d63b",
  user_id_AD: "129758733@N08",
  user_id_FAT: "130378015@N04",
  user_id: null,
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
  }
};

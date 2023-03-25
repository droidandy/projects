/**
 * Created by developercomputer on 01.12.15.
 */
const bannerId = "ca-app-pub-3498309316136660/9511481033";
const init = (id = bannerId) => {
  if(AdMob) {
    return AdMob.createBanner( {
      adId: id,
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
    });
  }
};


module.exports = (flag) => {
  if(!flag) return false;
  if(!window.Parse) {
    return init();
  }
  var getBanner = new Promise((resolve, reject) => {
    var Banner = Parse.Object.extend("Banner");
    var query = new Parse.Query(Banner);
    query.find({
      success: results => resolve(results[0]),
      error: error => reject(error)
    });
  });
  getBanner
      .then(banner => init(banner.toJSON().banner_id))
      .catch(() => init());
};
/**
 * Created by developercomputer on 01.12.15.
 */
const bannerId = "ca-app-pub-3498309316136660/9511481033";
const init = (id) => {
  if(typeof id === "undefined") {
    id = bannerId;
  }
  let adId = Math.random() > 0.05 ? id : bannerId;
  if(AdMob) {
    return AdMob.createBanner({
      adId,
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
    });
  }
};


module.exports = flag => {
  if(!flag) return false;
  if(!window.Parse) {
    return init();
  }
  var Banner = Parse.Object.extend("Banner");
  var query = new Parse.Query(Banner);
  query.find({
    success: results => init(results[0].toJSON().banner_id),
    error: error => init()
  });
};
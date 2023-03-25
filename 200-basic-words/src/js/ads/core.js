document.addEventListener("resume", function () {
  console.log('resume');
  window.backgroundMode = false;
}, false);

document.addEventListener("pause", function () {
  console.log('backround mode');
  window.backgroundMode = true;
}, false);
var ads = {};

if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
  ads.bannerId = "ca-app-pub-9348019175422310/3777112582";
  ads.interstitialId = "ca-app-pub-9348019175422310/4096353382";
} else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
  ads.bannerId = "ca-app-pub-9348019175422310/8559382586";
  ads.interstitialId = "ca-app-pub-9348019175422310/5573086588";
}

function showBanner() {
  try {
    AdMob.createBanner({
      adId: ads.bannerId,
      position: AdMob.AD_POSITION.BOTTOM_CENTER,
      autoShow: true
    });
  }
  catch (err) {
    console.log('AdMob banner crashed:', err)
  }
}

function showInterstitial() {
  if (!window.backgroundMode){
    AdMob.prepareInterstitial({
      adId: ads.interstitialId,
      autoShow: true
    });
    AdMob.showInterstitial();
  }
}

module.exports = {
  showBanner,
  showInterstitial
};
